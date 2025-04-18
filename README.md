# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

Data Sources:
- Outreach Data: LinkedIn/Twitter/X profiles, email responses, call logs.
- Campaign Data: Sequences, templates, interaction logs.
- Compliance Data: LinkedIn ToS, GDPR rules, user consent logs.
- Offline Data: Cached via WatermelonDB.

Feature Engineering:
- Extract features (e.g., response rate), normalize with `StandardScaler`.
Example:
```python
from sklearn.preprocessing import StandardScaler
df = pd.DataFrame({"response_rate": [0.5], "connections": [500]})
scaler = StandardScaler()
features = scaler.fit_transform(df)
```
