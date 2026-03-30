"""
Revolut Mexico Corridor Analysis
=================================
Analyzes Banxico remittance data to identify high-opportunity corridors
for Revolut's Mexico expansion.

Outputs: JSON files + HTML visualizations for the web page.
"""

import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import json
import os

# ============================================================
# SETUP
# ============================================================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW_DIR = os.path.join(BASE_DIR, "data", "raw")
PROCESSED_DIR = os.path.join(BASE_DIR, "data", "processed")
OUTPUT_DIR = os.path.join(BASE_DIR, "outputs", "visualizations")

os.makedirs(PROCESSED_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ============================================================
# 1. LOAD & CLEAN DATA
# ============================================================

print("Loading data...")

# State-level remittances (Mexico receiving side)
df_state = pd.read_csv(os.path.join(RAW_DIR, "remesas_entidad.csv"))
df_state["PERIODO"] = pd.to_datetime(df_state["PERIODO"])
df_state["VALOR_USD_M"] = df_state["VALOR_USD"] / 1_000_000  # Convert to millions
df_state["YEAR"] = df_state["PERIODO"].dt.year
df_state["QUARTER"] = df_state["PERIODO"].dt.quarter

# US origin data (sending side)
df_usa = pd.read_csv(os.path.join(RAW_DIR, "remesas_usa.csv"))
df_usa["PERIODO"] = pd.to_datetime(df_usa["PERIODO"])
df_usa["VALOR_USD_M"] = df_usa["VALOR_USD"] / 1_000_000

# Translate Spanish US state names to English
us_name_map = {
    "Carolina Del Norte": "North Carolina", "Carolina Del Sur": "South Carolina",
    "Dakota Del Norte": "North Dakota", "Dakota Del Sur": "South Dakota",
    "Luisiana": "Louisiana", "Mississipi": "Mississippi", "Misuri": "Missouri",
    "Nueva Jersey": "New Jersey", "Nueva York": "New York",
    "Nuevo Hampshire": "New Hampshire", "Nuevo Mexico": "New Mexico",
    "Pensilvania": "Pennsylvania", "No Identificado": "Unidentified",
}
df_usa["ESTADO"] = df_usa["ESTADO"].replace(us_name_map)

# National monthly totals
df_national = pd.read_csv(os.path.join(RAW_DIR, "remesas_mensuales.csv"))
df_national["PERIODO"] = pd.to_datetime(df_national["PERIODO"])
df_national["VALOR_USD_M"] = df_national["VALOR_USD"] / 1_000_000

print(f"State data: {len(df_state)} rows, {df_state['ENTIDAD'].nunique()} states")
print(f"US origin data: {len(df_usa)} rows, {df_usa['ESTADO'].nunique()} US states")
print(f"National data: {len(df_national)} rows")

# ============================================================
# 2. STATE-LEVEL ANALYSIS
# ============================================================

print("\nAnalyzing state-level remittances...")

# Annual totals by state (using full years only)
df_annual = (
    df_state[df_state["YEAR"].between(2015, 2024)]
    .groupby(["YEAR", "ENTIDAD"])["VALOR_USD_M"]
    .sum()
    .reset_index()
)

# Latest full year (2024) totals
latest_year = 2024
df_2024 = df_annual[df_annual["YEAR"] == latest_year].sort_values("VALOR_USD_M", ascending=False)

print(f"\nTop 10 states by remittance volume ({latest_year}, USD millions):")
for _, row in df_2024.head(10).iterrows():
    print(f"  {row['ENTIDAD']:25s} ${row['VALOR_USD_M']:,.0f}M")

# ============================================================
# 3. GROWTH ANALYSIS (3-year CAGR: 2021 vs 2024)
# ============================================================

print("\nCalculating growth rates...")

df_2021 = df_annual[df_annual["YEAR"] == 2021].set_index("ENTIDAD")["VALOR_USD_M"]
df_2024_idx = df_annual[df_annual["YEAR"] == 2024].set_index("ENTIDAD")["VALOR_USD_M"]

growth = pd.DataFrame({
    "vol_2021": df_2021,
    "vol_2024": df_2024_idx,
})
growth["cagr_3yr"] = (growth["vol_2024"] / growth["vol_2021"]) ** (1/3) - 1
growth = growth.sort_values("cagr_3yr", ascending=False)

print("\nTop 10 states by 3-year CAGR (2021-2024):")
for state, row in growth.head(10).iterrows():
    print(f"  {state:25s} CAGR: {row['cagr_3yr']:.1%} ({row['vol_2021']:.0f}M → {row['vol_2024']:.0f}M)")

# ============================================================
# 4. OPPORTUNITY SCORING
# ============================================================

print("\nBuilding opportunity scores...")

# Scoring factors:
# 1. Volume (30%) - higher is better
# 2. Growth CAGR (25%) - faster growing is better
# 3. Volume per capita proxy (20%) - higher remittance dependency = stickier users
# 4. Concentration risk (15%) - states where fewer fintechs operate
# 5. Average transaction implied (10%) - higher avg = more revenue per tx

# We use volume rank as proxy for fintech attention (top states get all the competition)
scores = pd.DataFrame(index=growth.index)

# Factor 1: Volume (normalized 0-1, higher = better)
scores["volume"] = growth["vol_2024"]
scores["volume_norm"] = (scores["volume"] - scores["volume"].min()) / (scores["volume"].max() - scores["volume"].min())

# Factor 2: Growth
scores["cagr"] = growth["cagr_3yr"]
scores["cagr_norm"] = (scores["cagr"] - scores["cagr"].min()) / (scores["cagr"].max() - scores["cagr"].min())

# Factor 3: Volume rank (inverse as competition proxy — rank 1 = most competition)
scores["volume_rank"] = scores["volume"].rank(ascending=False)
# States ranked 10-32 are underserved (less fintech attention)
scores["underserved_norm"] = (scores["volume_rank"] - 1) / (scores["volume_rank"].max() - 1)

# Factor 4: Growth acceleration (2023-2024 vs 2021-2022)
df_2022 = df_annual[df_annual["YEAR"] == 2022].set_index("ENTIDAD")["VALOR_USD_M"]
df_2023 = df_annual[df_annual["YEAR"] == 2023].set_index("ENTIDAD")["VALOR_USD_M"]

early_growth = (df_2022 / df_2021) - 1
late_growth = (df_2024_idx / df_2023) - 1
acceleration = late_growth - early_growth
scores["acceleration"] = acceleration
scores["accel_norm"] = (scores["acceleration"] - scores["acceleration"].min()) / (scores["acceleration"].max() - scores["acceleration"].min())

# Composite score
weights = {
    "volume_norm": 0.30,
    "cagr_norm": 0.25,
    "underserved_norm": 0.20,  # This is the non-obvious factor
    "accel_norm": 0.25,
}

scores["composite"] = sum(scores[k] * v for k, v in weights.items())
scores["composite_rank"] = scores["composite"].rank(ascending=False).astype(int)
scores = scores.sort_values("composite", ascending=False)

print("\n" + "="*80)
print("OPPORTUNITY SCORECARD — All 32 Mexican States")
print("="*80)
print(f"{'Rank':>4} {'State':25s} {'Volume 2024':>12s} {'CAGR 3yr':>10s} {'Vol Rank':>10s} {'Score':>8s}")
print("-"*80)
for state, row in scores.iterrows():
    print(f"{row['composite_rank']:4.0f} {state:25s} ${row['volume']:>10,.0f}M {row['cagr']:.1%}    #{row['volume_rank']:.0f}      {row['composite']:.3f}")

# ============================================================
# 5. KEY INSIGHT: Volume Rank vs Opportunity Rank
# ============================================================

print("\n" + "="*80)
print("KEY INSIGHT: States that rank higher in opportunity than in pure volume")
print("These are UNDERSERVED corridors — high growth + less competition")
print("="*80)

scores["volume_rank_int"] = scores["volume_rank"].astype(int)
scores["rank_delta"] = scores["volume_rank_int"] - scores["composite_rank"]
movers = scores[scores["rank_delta"] > 3].sort_values("rank_delta", ascending=False)

for state, row in movers.iterrows():
    print(f"  {state:25s} Volume rank: #{int(row['volume_rank_int']):2d} → Opportunity rank: #{int(row['composite_rank']):2d} (↑{int(row['rank_delta'])} positions)")

# ============================================================
# 6. US ORIGIN ANALYSIS (Corridor mapping)
# ============================================================

print("\nAnalyzing US origin corridors...")

# 2024 data
df_usa_2024 = df_usa[df_usa["PERIODO"].dt.year == 2024].groupby("ESTADO")["VALOR_USD_M"].sum().sort_values(ascending=False)

print(f"\nTop 10 US states sending remittances to Mexico ({latest_year}):")
for state, vol in df_usa_2024.head(10).items():
    print(f"  {state:25s} ${vol:,.0f}M")

# US state growth
df_usa_2021 = df_usa[df_usa["PERIODO"].dt.year == 2021].groupby("ESTADO")["VALOR_USD_M"].sum()
df_usa_2024_g = df_usa[df_usa["PERIODO"].dt.year == 2024].groupby("ESTADO")["VALOR_USD_M"].sum()

us_growth = pd.DataFrame({
    "vol_2021": df_usa_2021,
    "vol_2024": df_usa_2024_g,
})
us_growth["cagr_3yr"] = (us_growth["vol_2024"] / us_growth["vol_2021"]) ** (1/3) - 1
us_growth = us_growth.sort_values("vol_2024", ascending=False)

# ============================================================
# 7. UNIT ECONOMICS MODEL
# ============================================================

print("\n" + "="*80)
print("UNIT ECONOMICS MODEL")
print("="*80)

# Top corridor: California (biggest US sender) → Top MX states
ca_volume_2024 = us_growth.loc["California", "vol_2024"]
total_us_2024 = us_growth["vol_2024"].sum()
ca_share = ca_volume_2024 / total_us_2024

# Model parameters
corridor_volume = ca_volume_2024  # California corridor in USD millions
market_share_target = 0.02  # 2% capture
avg_transaction = 390  # USD, from Banxico average
revenue_per_tx_fee = 3.00  # Conservative: $3 average fee
revenue_per_tx_fx = 1.50  # FX spread revenue estimate
revenue_per_tx = revenue_per_tx_fee + revenue_per_tx_fx
tx_per_user_year = 16  # Mid-range of 14-18 Banxico frequency
cac_low = 15  # Fintech benchmark low
cac_high = 40  # Fintech benchmark high

# Calculations
addressable_volume = corridor_volume * 1_000_000  # Back to USD
addressable_tx = addressable_volume / avg_transaction
capture_tx = addressable_tx * market_share_target
capture_users = capture_tx / tx_per_user_year
annual_revenue = capture_tx * revenue_per_tx
cac_investment_low = capture_users * cac_low
cac_investment_high = capture_users * cac_high
ltv = revenue_per_tx * tx_per_user_year * 3  # 3-year LTV
ltv_cac_low = ltv / cac_low
ltv_cac_high = ltv / cac_high
payback_months_low = cac_low / (revenue_per_tx * tx_per_user_year / 12)
payback_months_high = cac_high / (revenue_per_tx * tx_per_user_year / 12)

print(f"""
California → Mexico Corridor (2024 data)
-----------------------------------------
Corridor annual volume:     ${corridor_volume:,.0f}M USD
California share of US→MX:  {ca_share:.1%}
Target market share:        {market_share_target:.0%}

At {market_share_target:.0%} capture:
  Transactions/year:        {capture_tx:,.0f}
  Users needed:             {capture_users:,.0f}
  Annual revenue:           ${annual_revenue/1_000_000:,.1f}M

  CAC investment:           ${cac_investment_low/1_000_000:,.1f}M - ${cac_investment_high/1_000_000:,.1f}M
  3-year LTV per user:      ${ltv:,.0f}
  LTV:CAC ratio:            {ltv_cac_high:.1f}x - {ltv_cac_low:.1f}x
  CAC payback:              {payback_months_low:.1f} - {payback_months_high:.1f} months

Key assumptions:
  - Avg transaction: ${avg_transaction} (Banxico average)
  - Revenue/tx: ${revenue_per_tx:.2f} (fee + FX spread)
  - Tx/user/year: {tx_per_user_year} (Banxico frequency)
  - CAC range: ${cac_low}-${cac_high} (fintech benchmarks)
  - LTV horizon: 3 years
""")

# ============================================================
# 8. GENERATE VISUALIZATIONS (Plotly HTML + JSON)
# ============================================================

print("Generating visualizations...")

# --- Chart 1: Choropleth Map of Mexico by Opportunity Score ---

# Mexico state codes for plotly (ISO 3166-2:MX)
state_codes = {
    "Aguascalientes": "MX-AGU", "Baja California": "MX-BCN", "Baja California Sur": "MX-BCS",
    "Campeche": "MX-CAM", "Coahuila": "MX-COA", "Colima": "MX-COL",
    "Chiapas": "MX-CHP", "Chihuahua": "MX-CHH", "Ciudad de México": "MX-CMX",
    "Durango": "MX-DUR", "Estado de México": "MX-MEX", "Guanajuato": "MX-GUA",
    "Guerrero": "MX-GRO", "Hidalgo": "MX-HID", "Jalisco": "MX-JAL",
    "Michoacán": "MX-MIC", "Morelos": "MX-MOR", "Nayarit": "MX-NAY",
    "Nuevo León": "MX-NLE", "Oaxaca": "MX-OAX", "Puebla": "MX-PUE",
    "Querétaro": "MX-QUE", "Quintana Roo": "MX-ROO", "San Luis Potosí": "MX-SLP",
    "Sinaloa": "MX-SIN", "Sonora": "MX-SON", "Tabasco": "MX-TAB",
    "Tamaulipas": "MX-TAM", "Tlaxcala": "MX-TLA", "Veracruz": "MX-VER",
    "Yucatán": "MX-YUC", "Zacatecas": "MX-ZAC",
}

scores["iso_code"] = scores.index.map(state_codes)

# --- Chart 2: Volume Rank vs Opportunity Rank (the insight chart) ---

chart2_data = scores.copy()
chart2_data["state"] = chart2_data.index

fig2 = go.Figure()

fig2.add_trace(go.Bar(
    name="Volume Rank",
    x=chart2_data.sort_values("composite_rank").head(15)["state"],
    y=chart2_data.sort_values("composite_rank").head(15)["volume_rank_int"],
    marker_color="#94a3b8",
    text=chart2_data.sort_values("composite_rank").head(15)["volume_rank_int"].apply(lambda x: f"#{x:.0f}"),
    textposition="outside",
))

fig2.add_trace(go.Bar(
    name="Opportunity Rank",
    x=chart2_data.sort_values("composite_rank").head(15)["state"],
    y=chart2_data.sort_values("composite_rank").head(15)["composite_rank"],
    marker_color="#0666eb",
    text=chart2_data.sort_values("composite_rank").head(15)["composite_rank"].apply(lambda x: f"#{x}"),
    textposition="outside",
))

fig2.update_layout(
    title=dict(text="Volume Rank vs Opportunity Rank — Top 15 States", font=dict(size=18)),
    barmode="group",
    yaxis=dict(title="Rank (lower is better)", autorange="reversed"),
    xaxis=dict(title="", tickangle=-45),
    template="plotly_white",
    height=500,
    legend=dict(orientation="h", yanchor="bottom", y=1.02),
    margin=dict(b=120),
)

fig2.write_html(os.path.join(OUTPUT_DIR, "rank_comparison.html"), include_plotlyjs="cdn")

# --- Chart 3: Growth Trajectory of Top 5 Opportunity States ---

top5 = scores.head(5).index.tolist()
df_top5 = df_annual[df_annual["ENTIDAD"].isin(top5)]

fig3 = px.line(
    df_top5,
    x="YEAR",
    y="VALOR_USD_M",
    color="ENTIDAD",
    title="Remittance Growth Trajectory — Top 5 Opportunity States",
    labels={"VALOR_USD_M": "Annual Remittances (USD Millions)", "YEAR": "Year", "ENTIDAD": "State"},
    template="plotly_white",
    color_discrete_sequence=["#0666eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
)
fig3.update_layout(height=450, legend=dict(orientation="h", yanchor="bottom", y=1.02))
fig3.write_html(os.path.join(OUTPUT_DIR, "growth_trajectory.html"), include_plotlyjs="cdn")

# --- Chart 4: US Origin States (Top 10) ---

us_top10 = us_growth.head(10)
fig4 = go.Figure(go.Bar(
    x=us_top10["vol_2024"],
    y=us_top10.index,
    orientation="h",
    marker_color="#0666eb",
    text=us_top10["vol_2024"].apply(lambda x: f"${x:,.0f}M"),
    textposition="outside",
))

fig4.update_layout(
    title=dict(text="Top 10 US States Sending Remittances to Mexico (2024)", font=dict(size=18)),
    xaxis=dict(title="Annual Volume (USD Millions)"),
    yaxis=dict(autorange="reversed"),
    template="plotly_white",
    height=450,
    margin=dict(l=150, r=100),
)
fig4.write_html(os.path.join(OUTPUT_DIR, "us_origin.html"), include_plotlyjs="cdn")

# --- Chart 5: National Trend ---

df_yearly = df_national.groupby(df_national["PERIODO"].dt.year)["VALOR_USD_M"].sum().reset_index()
df_yearly.columns = ["year", "total"]
df_yearly = df_yearly[df_yearly["year"].between(2010, 2024)]

fig5 = go.Figure(go.Bar(
    x=df_yearly["year"],
    y=df_yearly["total"] / 1000,
    marker_color="#0666eb",
    text=(df_yearly["total"] / 1000).apply(lambda x: f"${x:.1f}B"),
    textposition="outside",
))

fig5.update_layout(
    title=dict(text="Mexico Total Remittance Income (2010-2024)", font=dict(size=18)),
    xaxis=dict(title="Year", dtick=1),
    yaxis=dict(title="Annual Total (USD Billions)"),
    template="plotly_white",
    height=400,
)
fig5.write_html(os.path.join(OUTPUT_DIR, "national_trend.html"), include_plotlyjs="cdn")

# ============================================================
# 9. EXPORT DATA FOR WEB
# ============================================================

print("Exporting data for web...")

# Scorecard data
scorecard = []
for state, row in scores.iterrows():
    scorecard.append({
        "state": state,
        "composite_score": round(row["composite"], 3),
        "composite_rank": int(row["composite_rank"]),
        "volume_2024_m": round(row["volume"], 1),
        "volume_rank": int(row["volume_rank"]),
        "cagr_3yr": round(row["cagr"], 4),
        "rank_delta": int(row.get("rank_delta", 0)),
        "iso_code": row.get("iso_code", ""),
    })

with open(os.path.join(PROCESSED_DIR, "scorecard.json"), "w") as f:
    json.dump(scorecard, f, indent=2)

# US origin data
us_origin = []
for state, row in us_growth.head(15).iterrows():
    us_origin.append({
        "state": state,
        "volume_2024_m": round(row["vol_2024"], 1),
        "cagr_3yr": round(row["cagr_3yr"], 4),
    })

with open(os.path.join(PROCESSED_DIR, "us_origin.json"), "w") as f:
    json.dump(us_origin, f, indent=2)

# National trend
national_trend = []
for _, row in df_yearly.iterrows():
    national_trend.append({
        "year": int(row["year"]),
        "total_billions": round(row["total"] / 1000, 2),
    })

with open(os.path.join(PROCESSED_DIR, "national_trend.json"), "w") as f:
    json.dump(national_trend, f, indent=2)

# Unit economics
unit_econ = {
    "corridor": "California → Mexico",
    "corridor_volume_m": round(corridor_volume, 0),
    "ca_share_of_total": round(ca_share, 3),
    "market_share_target": market_share_target,
    "avg_transaction_usd": avg_transaction,
    "revenue_per_tx": revenue_per_tx,
    "tx_per_user_year": tx_per_user_year,
    "capture_transactions": int(capture_tx),
    "capture_users": int(capture_users),
    "annual_revenue_m": round(annual_revenue / 1_000_000, 1),
    "cac_range": [cac_low, cac_high],
    "ltv_3yr": ltv,
    "ltv_cac_range": [round(ltv_cac_high, 1), round(ltv_cac_low, 1)],
    "payback_months_range": [round(payback_months_low, 1), round(payback_months_high, 1)],
}

with open(os.path.join(PROCESSED_DIR, "unit_economics.json"), "w") as f:
    json.dump(unit_econ, f, indent=2)

# Competitor data
competitors = [
    {"provider": "Revolut", "fee_usd": 0.00, "fx_markup_pct": 0.0, "total_cost_usd": 0.00, "recipient_mxn": 5437, "delivery_options": "Bank, Revolut-to-Revolut", "delivery_time": "20s (R2R) / 3-5 days (bank)", "cash_pickup": False, "note": "Free on weekdays within limits (promo)"},
    {"provider": "Wise", "fee_usd": 2.64, "fx_markup_pct": 0.03, "total_cost_usd": 2.64, "recipient_mxn": 5389, "delivery_options": "Bank deposit", "delivery_time": "< 20 seconds (74%)", "cash_pickup": False, "note": "Mid-market rate, transparent fees"},
    {"provider": "Remitly", "fee_usd": 1.99, "fx_markup_pct": 0.4, "total_cost_usd": 1.99, "recipient_mxn": 5370, "delivery_options": "Bank, cash, mobile wallet", "delivery_time": "Minutes (Express) / 3-5 days (Economy)", "cash_pickup": True, "note": "OXXO, 7-Eleven, Banco Azteca"},
    {"provider": "Xoom", "fee_usd": 0.00, "fx_markup_pct": 1.75, "total_cost_usd": 0.00, "recipient_mxn": 5340, "delivery_options": "Bank, cash, mobile wallet", "delivery_time": "~1 hour (bank)", "cash_pickup": True, "note": "OXXO, Elektra, Walmart, Mercado Pago"},
    {"provider": "Western Union", "fee_usd": 5.00, "fx_markup_pct": 1.9, "total_cost_usd": 5.00, "recipient_mxn": 5245, "delivery_options": "Bank, cash, card", "delivery_time": "Minutes (cash) / 1-3 days (bank)", "cash_pickup": True, "note": "50,000+ Mexico locations"},
]

with open(os.path.join(PROCESSED_DIR, "competitors.json"), "w") as f:
    json.dump(competitors, f, indent=2)

# Top 5 opportunity states detail for web
top5_detail = []
for state in scores.head(5).index:
    row = scores.loc[state]
    # Get yearly data for sparkline
    yearly = df_annual[df_annual["ENTIDAD"] == state].sort_values("YEAR")
    top5_detail.append({
        "state": state,
        "composite_rank": int(row["composite_rank"]),
        "volume_2024_m": round(row["volume"], 1),
        "volume_rank": int(row["volume_rank"]),
        "cagr_3yr": round(row["cagr"], 4),
        "rank_delta": int(row.get("rank_delta", 0)),
        "yearly_data": [{"year": int(r["YEAR"]), "volume_m": round(r["VALOR_USD_M"], 1)} for _, r in yearly.iterrows()],
    })

with open(os.path.join(PROCESSED_DIR, "top5_opportunities.json"), "w") as f:
    json.dump(top5_detail, f, indent=2)

print("\n✅ All outputs generated:")
print(f"  Visualizations: {OUTPUT_DIR}/")
for f in os.listdir(OUTPUT_DIR):
    print(f"    - {f}")
print(f"  Data JSONs: {PROCESSED_DIR}/")
for f in os.listdir(PROCESSED_DIR):
    print(f"    - {f}")

print("\n🏁 Analysis complete.")
