const vision = require('@google-cloud/vision');
const imageDataModel = require('../models/imageDataModel');
const detectedObjectDataModel = require('../models/objectDetectedDataModel');

// Creates a client in google vision 
const client = new vision.ImageAnnotatorClient({
  keyFilename: "src/Config/cloudVisionKey.json",
});

const analyzeNewImage = async (req, res) => {
  try {
    const imageUrl = req.body.requests[0].image.source.imageUri;
    const label = req.body.requests[0]?.labels?.label || "Default Label";
    const enableObjectDetection = req.body.enableObjectDetection !== false;
    const features = [{ type: "OBJECT_LOCALIZATION" }];

    if (enableObjectDetection) {
      features.push({ type: "OBJECT_LOCALIZATION", maxResults: 10 });
    }

    //Annotate the image using Google Vision API
    const [result] = await client.annotateImage({
      image: { source: { imageUri: imageUrl } },
      features: features
    });

    //Extract objects from the annotation result
    const objects = enableObjectDetection ? (result.localizedObjectAnnotations || []) : [];

    //Save image metadata to the images table
    const image = await imageDataModel.create({
      imageUrl: imageUrl,
      label: label,
      objectDetectionEnabled: enableObjectDetection
    });

    //Extract data from objects array
    const dataToSave = objects.map(object => ({
      imageUrl: imageUrl,
      label: label,
      objects: object.name.toLowerCase(),
      mid: object.mid,
      languageCode: object.languageCode,
      score: object.score,
      boundingpoly: object.boundingPoly,
      imageId: image.id
    }));

    // Save extracted data to the detectedObjects table
    await detectedObjectDataModel.bulkCreate(dataToSave);
    res.status(200).json({ imageUrl, label, objects });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  /*  #swagger.parameters['body'] = {
        in: 'body',
        description: 'Enter direct image URL for image to be sent to Google Vision API for Object Detection',
        schema: {
  "requests": [
    {
      "features": [
        {
          $maxResults: 10,
          "type": "OBJECT_LOCALIZATION"
        }
      ],
      "image": {
        "source": {
          $imageUri: "https://enter.image.url"
        }
      },
      "labels": {
        $label: "Default_Label"
      }
    }
  ],
  $enableObjectDetection: true
        }
}
#swagger.tags = ['images']
*/
}

const getAllImageMetaData = async (req, res) => {
  try {
    const imagesWithObjects = await imageDataModel.findAll({
      include: [detectedObjectDataModel]
    });
    if (imagesWithObjects.length === 0) {
      res.status(404).json({ error: "No images found" });
      return;
    }
    res.status(200).json(imagesWithObjects);
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  //#swagger.tags = ['images']
}

const getImagesBySpecifiedObjects = async (req, res) => {
  try {
    let requestedObjects = req.query.objects;
    console.log('Query PARAM:', requestedObjects);
    if (typeof requestedObjects === 'string') {
      requestedObjects = requestedObjects.toLowerCase();
    }
    if (typeof requestedObjects === 'string' && requestedObjects.includes(',')) {
      requestedObjects = requestedObjects.split(',').map(obj => obj.trim());
    }
    if (Array.isArray(requestedObjects)) {
      requestedObjects = requestedObjects.map(obj => obj.toLowerCase());
    }
    const matchingImages = await detectedObjectDataModel.findAll({
      where: { objects: requestedObjects },
      include: { model: imageDataModel }
    });
    if (matchingImages.length === 0) {
      res.status(404).json({ error: "Images not found for the specified objects" });
    } else {
      res.status(200).json(matchingImages);
    }
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  //#swagger.tags = ['images']
}

const getImageById = async (req, res) => {
  try {
    const id = req.params.id;
    const image = await imageDataModel.findByPk(id, {
      include: [detectedObjectDataModel]
    });
    if (!image) {
      res.status(404).json({ error: "Image not found" });
      return;
    }
    res.status(200).json(image);
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  //#swagger.tags = ['images']
}


module.exports = {
  getAllImageMetaData,
  getImagesBySpecifiedObjects,
  getImageById,
  analyzeNewImage
}