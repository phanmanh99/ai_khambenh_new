import tensorflow
from tensorflow.keras.applications import VGG16
from tensorflow.keras import optimizers
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, Flatten
from tensorflow.keras.callbacks import ReduceLROnPlateau, EarlyStopping
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from datetime import datetime

input_dir = "resources/static/assets/uploads/" # đường dẫn chứa 2 foder train và test (m)
train_dir = input_dir +"traning/" #link foder mẹ chứa 2 foder 0 vs 1 (0: NORMAL(bình thường); 1: PNEUMONIA(bị bệnh))
test_dir = input_dir +"test/" #tương tự train_dir nhưng để test, train_dir để train (update ảnh tại train_dir)

train_datagen = ImageDataGenerator(
                                rescale=1/255.0,
                               horizontal_flip=True,
                               zoom_range=0.2,
                               shear_range=0.2)

test_datagen = ImageDataGenerator(rescale=1./255)

batch_size = 2
train = train_datagen.flow_from_directory(
        train_dir,
        target_size=(224,224),
        batch_size=batch_size,
        class_mode='categorical')
test = test_datagen.flow_from_directory(
        test_dir,
        target_size=(224,224),
        batch_size=batch_size,
        class_mode='categorical')

reduce_lr = ReduceLROnPlateau(monitor="val_loss", factor=0.1, patience=2, verbose=1)

early_stopping = EarlyStopping(
    monitor="val_loss", min_delta=0, patience=3, verbose=1
)

vgg = VGG16(weights='imagenet',include_top=False,input_shape=(224,224,3))
    
x = Flatten()(vgg.output) #flattening out the last layery
predictions = Dense(2,activation='softmax')(x)
model = Model(inputs=vgg.input, outputs=predictions)
model.summary()

adam = optimizers.Adam(learning_rate = 1e-3)
model.compile(loss='categorical_crossentropy',optimizer=adam,metrics=['accuracy'])

model.fit(train,
        steps_per_epoch=2,
        epochs=2,
        validation_data=test,
        validation_steps=2
        #callbacks=[reduce_lr, early_stopping]
        )

date_stamp = datetime.now().strftime("%Y%m%d_%H%M%S")

model_path = "" #link thư mục chứa model đã học
model.save(f'chest_model_{date_stamp}.h5') #lưu model