const path = require('path');
const fs = require('fs');
const SFClient = require('../utils/sfmc-client');
const logger = require('../utils/logger');

let props;
let prop1;
let prop2;
callTest();

logger.info('props');
logger.info(props);

function test() {

  logger.info('Enter test');

  return new Promise(function(resolve, reject) {
    SFClient.deRow.get((err, res) => {
      if (err) {

        logger.info('Get err');

        logger.error(err.message);

        reject(err);
      } else {
  
        logger.info('Get result');
        
        props = [];
        let retVal = [];
        let commsMap={};
        let imageMap={};
        let inner;
        let innerImage;

        for (const result of res.body.Results) {
          logger.info(result.Properties);

          for (const property of result.Properties.Property) {
            logger.info(property);

/*            if (property.Name == 'DropDownJSON') {

              logger.info('Matched 1');

              prop1 = property.Value;

              logger.info(prop1);

              retVal.push(prop1);
              props.push(prop1);

  //            configTemplate2 = configTemplate.replace('%%COMMSCONFIG%%' , property.value);

            }
            if (property.Name == 'ImageJSON') {

              logger.info('Matched 2');

              prop2 = property.Value;

              logger.info(prop2);

              retVal.push(prop2);
              props.push(prop2);

    //          configTemplate3 = configTemplate2.replace('%%IMAGECONFIG%%' , property.value);

            } */
            if (property.Name == 'Vendor') {

              logger.info(JSON.stringify(commsMap));

              if (commsMap.hasOwnProperty(property.Value))
              {
                logger.info(commsMap[property.Value]);
                inner = commsMap[property.Value];
              }
              else {
                inner=[];
                let newVal = {};
                newVal.Name = 'Select Communication';
                newVal.Value = 'Select Communication';
                
                inner.push(newVal);
                commsMap[property.Value] = inner;
              }
            }
            if (property.Name == 'Communications') {
              let newVal = {};
              newVal.Name = property.Value;
              newVal.Value = property.Value;
              
              inner.push(newVal);

              if (imageMap.hasOwnProperty(property.Value))
              {
                logger.info(imageMap[property.Value]);
                innerImage = imageMap[property.Value];
              }
              else {
                innerImage=[];
                imageMap[property.Value] = innerImage;
              }


            }
            if (property.Name == 'PreviewURL') {
              let newVal = {};
              newVal.Name = property.Value;
              newVal.Value = property.Value;
              
              innerImage.push(newVal);
            }
          }
        }

        logger.info('Resolve');
        logger.info(commsMap);
        props.push('{"commsMap":' + JSON.stringify(commsMap) + '}');
        props.push('{"imageMap":' + JSON.stringify(imageMap) + '}');
        logger.info('props');
        logger.info(props);
                
        resolve(retVal);
      }
    });
	});

}

async function callTest() {

  logger.info('callTest');

  try {
		let dataFirst = await test();

    logger.info('Called test');

		logger.info(dataFirst);

    return dataFirst;

	} catch (error) {
    logger.info('Error test');
		logger.info(error);
	}

}
/**
 * Render Config
 * @param req
 * @param res
 */
exports.config = (req, res) => {
  const domain = req.headers.host || req.headers.origin;
  const file = path.join(__dirname, '..', 'public', 'config-template.json');

  let configTemplate = fs.readFileSync(file, 'utf-8');
  let configTemplate2;
  let configTemplate3;

  logger.info('props');
  logger.info(props);

  //logger.info(configTemplate);
  try {

    configTemplate2 = configTemplate.replace('%%COMMSCONFIG%%' , props[0]);

    logger.info(configTemplate2);

    configTemplate3 = configTemplate2.replace('%%IMAGECONFIG%%' , props[1]);

    logger.info(configTemplate3);

    let config = JSON.parse(configTemplate3.replace(/\$DOMAIN/g, domain));

    logger.info(config);

    res.json(config);

} catch (error) {

  logger.info('Get error');

  logger.error(JSON.stringify(error));  
}

  /*  try {
    SFClient.deRow.get((err, res) => {
      if (err) {

        logger.info('Get err');

        logger.error(err.message);
      } else {
  
        logger.info('Get result');
          
        for (const result of res.body.Results) {
          for (const property of result.Properties.Property) {
            logger.info(property);

            if (property.Name == 'DropDownJSON') {

              configTemplate2 = configTemplate.replace('%%COMMSCONFIG%%' , property.value);

            }
            if (property.Name == 'ImageJSON') {

              configTemplate3 = configTemplate2.replace('%%IMAGECONFIG%%' , property.value);

            }
          }
        }
      }
    });
} catch (error) {

  logger.info('Get error');

  logger.error(error);  
} */

};

/**
 * Render UI
 * @param req
 * @param res
 */
exports.ui = (req, res) => {
  res.render('index', {
    title: 'API Demo Connect',
    dropdownOptions: [
      {
        name: 'Select Vendor',
        value: 'Select Vendor',
      },
/*      {
        name: 'Edipost',
        value: 'Edipost',
      },
      {
        name: 'ONG Conseil',
        value: 'ONG Conseil',
      },
      {
        name: 'Call to Action',
        value: 'Call to Action',
      },
      {
        name: 'Voxens',
        value: 'Voxens',
      },*/
    ],
    dropdownCommunications: [
      {
        name: 'Select Communication',
        value: 'Select Communication',
      },
    ],
  });
};
