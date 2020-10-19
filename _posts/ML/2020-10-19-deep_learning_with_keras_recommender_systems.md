---
title: "Nouvelle Vague"
tags:
  - ML
  - Collaborative Filtering
  - projects
categories:
  - ML
last_modified_at: 2020-10-20T13:00:00+18:00
toc: true
---

# 개요
추천시스템 개발을 위해 예제를 참고하여 정리하였다.
파이썬 `keras`로 개발 후 `Flaks`를 이용해 간단한 API 설계로 서버와 통신하려한다.
아직 미흡한 점이 많은 시슽

# 코드
```python
import pandas as pd
import numpy as np
from zipfile import ZipFile
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from pathlib import Path
import matplotlib.pyplot as plt
from DNN.RecommenderNet import RecommenderNet

# get file for server or

ratings_file = "ratings.csv"
df = pd.read_csv(ratings_file)

user_ids = df["userId"].unique().tolist()
user2user_encoded = {x: i for i, x in enumerate(user_ids)}
userencoded2user = {i: x for i, x in enumerate(user_ids)}
book_ids = df["bookId"].unique().tolist()
book2book_encoded = {x: i for i, x in enumerate(book_ids)}
book_encoded2book = {i: x for i, x in enumerate(book_ids)}
df["user"] = df["userId"].map(user2user_encoded)
df["book"] = df["movieId"].map(book2book_encoded)

num_users = len(user2user_encoded)
num_books = len(book_encoded2book)
df["rating"] = df["rating"].values.astype(np.float32)
# min and max ratings will be used to normalize the ratings later
min_rating = min(df["rating"])
max_rating = max(df["rating"])

print(
    "Number of users: {}, Number of Movies: {}, Min rating: {}, Max rating: {}".format(
        num_users, num_books, min_rating, max_rating
    )
)

df = df.sample(frac=1, random_state=42)
x = df[["user", "book"]].values
# Normalize the targets between 0 and 1. Makes it easy to train.
y = df["rating"].apply(lambda x: (x - min_rating) / (max_rating - min_rating)).values
# Assuming training on 90% of the data and validating on 10%.
train_indices = int(0.9 * df.shape[0])
x_train, x_val, y_train, y_val = (
    x[:train_indices],
    x[train_indices:],
    y[:train_indices],
    y[train_indices:],
)

EMBEDDING_SIZE = 50
try:
    model = keras.models.load_model('recommender_model.h5')
except:
    model = RecommenderNet(num_users, num_books, EMBEDDING_SIZE)

model.compile(
    loss=tf.keras.losses.BinaryCrossentropy(), optimizer=keras.optimizers.Adam(lr=0.001)
)

history = model.fit(
    x=x_train,
    y=y_train,
    batch_size=64,
    epochs=5,
    verbose=1,
    validation_data=(x_val, y_val),
)

model.save('recommender_model.h5')
```
