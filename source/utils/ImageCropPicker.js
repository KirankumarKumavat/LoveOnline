import ImagePicker from 'react-native-image-crop-picker';
import { Platform } from 'react-native';
/**
* Options for Image Picker
*/
const options = {
    title: 'Select Profile Picture',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
    maxHeight: 450,
    maxWidth: 450,
    quality: 1,
    allowsEditing: true
};
/**
*
@param {} isBase64
* Image crop picker to pick image from camera
*/
export const pickCropImageFromCamera = async (isBase64) => {
    return new Promise(async (resolve) => {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            compressImageMaxHeight: 450,
            compressImageMaxWidth: 450,
            includeBase64: true,
            cropping: true,
        }).then(image => {
            if (image) {
                let imageUrl = Platform.OS == 'ios' ? "file://" + image.path : image.path
                if (isBase64) {
                    const base64Data = 'data:' + image.mime + ';base64,' + image.data;
                    resolve([{ base64Data, image: imageUrl }]);
                }
                resolve(imageUrl);
            } else return false;
        });
    })
}

/**
*
@param {} isBase64
* Image crop picker to pick image from Image Library
*/
export const pickCropImagedFromLibrary = async (isBase64) => {
    return new Promise(async (resolve) => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            compressImageMaxHeight: 450,
            compressImageMaxWidth: 450,
            includeBase64: true,
            cropping: true,
        }).then(image => {
            if (image) {
                let imageUrl = Platform.OS == 'ios' ? "file://" + image.sourceURL : image.path
                if (isBase64) {
                    const base64Data = 'data:' + image.mime + ';base64,' + image.data;
                    resolve([{ base64Data, image: imageUrl }]);
                }
                resolve(imageUrl);
            } else return false;
        });
    })
}


