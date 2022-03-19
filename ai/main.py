from abc import abstractmethod
import tensorflow
import numpy as np
import sys
import cv2

class Detector(object):
    @abstractmethod
    def predict(self, image):
        raise NotImplementedError("should implement in sub classes")


class DummyDetector(Detector):
    def __init__(self):
        pass

    def predict(self, image):
        return 0


class DetectorForFileSupport(Detector):

    @abstractmethod
    def predict_file(self, image_path):
        raise NotImplementedError("should implement in sub classes")


class RankDetector(DetectorForFileSupport):
    @abstractmethod
    def _initialize_detector(self):
        raise NotImplementedError("should implement in sub classes")

    def __init__(self):
        # print("Initialize RankDetector")
        self.detector = self._initialize_detector()

    def predict(self, image):
        predictions = self.detector.predict(np.array([image]))
        return predictions

    def predict_file(self, image_path, target_size=(460, 140)):
        image = tensorflow.keras.preprocessing.image.load_img(
            image_path, target_size=target_size)
        input_arr = tensorflow.keras.preprocessing.image.img_to_array(image)
        return self.predict(input_arr)


class KerasRankDetector(RankDetector):
    def __init__(self, model_path):
        self.model_path = model_path
        super().__init__()
        # print(f"model_path:{self.model_path}")

    def _initialize_detector(self):
        return tensorflow.keras.models.load_model(self.model_path)


def predictImg(image_path):
    height, width = 240, 430
    rank_detector = KerasRankDetector("./ai/chest_modelvgg16_chest14_2412.h5")
    result = rank_detector.predict_file(image_path, target_size=(height, width))
    # Biến idx là biến cho kết quả bằng 0 hoặc 1. Nếu = 0 là Bình thường, = 1 là bị viêm phổi
    idx = np.argmax(result[0])
    # return idx để lưu vào data
    return idx

# đường dẫn ảnh
image_path = "resources/static/assets/uploads/" + sys.argv[1]
img = cv2.imread(image_path)
x,y,z = img.shape
x_new = int(0.1953*x)
y_new = int(0.1042*y)
img_crop = img[x_new : (x - x_new), y_new : (y - y_new)]
gray = cv2.cvtColor(img_crop, cv2.COLOR_BGR2GRAY)
cv2.imwrite(f'./ai/imgtotest.jpg',gray)
# Gọi hàm predictImg
# print(image_path)
print(predictImg(f'./ai/imgtotest.jpg'))
