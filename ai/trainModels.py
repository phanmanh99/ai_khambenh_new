import os
from PIL import Image
import numpy as np # linear algebra
import pandas as pd # data processing
import matplotlib.pyplot as plt # data visualization
#from keras.models import Sequential
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.callbacks import ReduceLROnPlateau, EarlyStopping
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.layers import Input, Dense, Flatten, Conv2D, MaxPooling2D, Dropout
from tensorflow.keras import optimizers
import tensorflow as tf
from datetime import datetime

input_dir = "resources/static/assets/datamodel/" # đường dẫn chứa 2 foder train và test (m)
train_dir = input_dir +"training/" #link foder mẹ chứa 2 foder 0 vs 1 (0: NORMAL(bình thường); 1: PNEUMONIA(bị bệnh))
#test_dir = input_dir +"test/" #tương tự train_dir nhưng để test, train_dir để train (update ảnh tại train_dir)

# train_dir = "D:/chest_rsna/images"
# train_dir = "D:\XQuangPhoi\X-QUANG PHOI TRAIN"
# test_dir = "D:\XQuangPhoi\X-QUANG PHOI TEST"

train_datagen = ImageDataGenerator(rescale=1/255.0,
        rotation_range=20,
        width_shift_range=0.1,
        height_shift_range=0.1,
        shear_range=0.1,
        samplewise_center=True,
        samplewise_std_normalization=True,
        horizontal_flip=True,
        brightness_range=[0.5,1.5],
        zoom_range=0.1,
        validation_split=0.05
        )


test_datagen = ImageDataGenerator(rescale=1./255)
height, width = 240, 430
batch_size = 32
train = train_datagen.flow_from_directory(
        train_dir,
        target_size=(height,width),
        batch_size=batch_size,
        class_mode='categorical',
        subset='training',
        )
test = train_datagen.flow_from_directory(
        train_dir,
        target_size=(height,width),
        batch_size=batch_size,
        class_mode='categorical',
        subset='validation'
        )

reduce_lr = ReduceLROnPlateau(monitor="val_loss", factor=0.1, patience=3, verbose=1)

early_stopping = EarlyStopping(
    monitor="val_loss", min_delta=0, patience=10, verbose=1
)

model = Sequential()
model.add(Input(shape=(height, width, 3)))

#1st conv
model.add(Conv2D(64, (3, 3), padding='same', activation='relu'))
##model.add(Conv2D(64, (3, 3), padding='same', activation='relu'))
model.add(MaxPooling2D(pool_size = (2,2)))

#2nd conv
model.add(Conv2D(128, (3, 3), padding='same', activation='relu'))
#model.add(Conv2D(128, (3, 3), padding='same', activation='relu'))
model.add(MaxPooling2D(pool_size = (2,2)))

#3rd conv
model.add(Conv2D(128, (3, 3), padding='same', activation='relu'))
#model.add(Conv2D(128, (3, 3), padding='same', activation='relu'))
model.add(MaxPooling2D(pool_size = (2,2)))

#4th conv
model.add(Conv2D(256, (3, 3), padding='same', activation='relu'))
#model.add(Conv2D(256, (3, 3), padding='same', activation='relu'))
model.add(MaxPooling2D(pool_size = (2,2)))

#5th conv, 256
model.add(Conv2D(256, (3, 3), padding='same', activation='relu'))
#model.add(Conv2D(256, (3, 3), padding='same', activation='relu'))
model.add(MaxPooling2D(pool_size = (2,2)))

#6th conv, 256
model.add(Conv2D(256, (3, 3), padding='same', activation='relu'))
#model.add(Conv2D(256, (3, 3), padding='same', activation='relu'))
model.add(MaxPooling2D(pool_size = (2,2)))

#7th conv, 128
model.add(Conv2D(128, (3, 3), padding='same', activation='relu'))
#model.add(Conv2D(128, (3, 3), padding='same', activation='relu'))
model.add(MaxPooling2D(pool_size = (2,2)))

#flat
model.add(Flatten())
model.add(Dropout(.5))
model.add(Dense(512, activation = 'relu'))
#model.add(Dropout(.5))
model.add(Dense(512, activation = 'relu'))
#model.add(Dropout(.5))

#output
output_num = 2
model.add(Dense(output_num, activation = 'softmax'))                                            
model.summary()

adam = optimizers.Adam(lr = 1e-3)
model.compile(loss = 'categorical_crossentropy', optimizer = adam, metrics = ['accuracy'])

nb_epochs_warm_up = 10 #40
model.fit(
    train,
    steps_per_epoch = train.samples//batch_size,
    validation_data = test, 
    validation_steps = test.samples//batch_size,
    epochs = nb_epochs_warm_up
)

nb_epochs_best_model = 40  #100
model.fit(
    train,
    steps_per_epoch = train.samples//batch_size,
    validation_data = test, 
    validation_steps = test.samples//batch_size,
    epochs = nb_epochs_best_model + nb_epochs_warm_up,
    initial_epoch=nb_epochs_warm_up,
    callbacks=[reduce_lr, early_stopping]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
)

date_stamp = datetime.now().strftime("%Y%m%d_%H%M%S")

model_path = "" #link thư mục chứa model đã học
model.save(f'chest_model_{date_stamp}.h5') #lưu model