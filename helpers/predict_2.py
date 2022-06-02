import json
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
import pandas as pd
import pickle

model = pickle.load(open("./helpers/model.pkl", "rb"))

keystroke_data = pd.read_csv("./helpers/input.csv")
keystroke_data = keystroke_data.drop('username', 1)

features = keystroke_data.values
scaler = StandardScaler()
scaled_features = scaler.fit_transform(features)

pca = pickle.load(open("./helpers/pca.pkl", "rb"))
features_pca = pca.transform(scaled_features)

stressLevel = model.predict(features_pca)
val = str(stressLevel)

dictionary = {
    "stressLevel": val
}

json_object = json.dumps(dictionary, indent=4)

with open("./helpers/prediction.json", "w") as outfile:
    outfile.write(json_object)
