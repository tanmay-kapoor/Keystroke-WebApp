import json
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
import pandas as pd
import pickle

model = pickle.load(open("model.pkl", "rb"))

og = pd.read_csv("entries.csv")
keystroke_data = pd.read_csv("entries.csv")
keystroke_data = keystroke_data.drop(['username', 'stressLevel'], 1)

features = keystroke_data.values
scaler = StandardScaler()
scaled_features = scaler.fit_transform(features)

pca = pickle.load(open("pca.pkl", "rb"))
features_pca = pca.transform(scaled_features)

preds = []
for i in range(len(features_pca)):
    stressLevel = model.predict([features_pca[i]])
    actual = 1
    if(og.iloc[i]["stressLevel"] == 0):
        actual = 0

    preds.append(
        {"actual": actual, "predicted": stressLevel[0]})

for pair in preds:
    print(pair)
