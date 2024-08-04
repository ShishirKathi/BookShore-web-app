import React from 'react';
import * as AWS from 'aws-sdk';

// Configure AWS SDK
AWS.config.update({
  region: "us-east-1",
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const dbClient = new AWS.DynamoDB.DocumentClient();
const ses = new AWS.SES({ 
    region: process.env.REACT_APP_REGION,
    smtp: {
        host: process.env.REACT_APP_HOST,
        port: 587,
        auth: {
            user: process.env.REACT_APP_UID, 
            pass: process.env.REACT_APP_PSWD,
        }
    }
});

const Mail = ({ email , cart}) => {
    const generateOrderSummary = (cart) => {
        const input = cart.line_items;
        let resultString = '';
    
        for (let [key, value] of Object.entries(input)) {
          resultString += `${value['name']}, ${value['line_total']['formatted_with_symbol']}\n`;
        }
    
        resultString += `\nTotal: ${cart.subtotal['formatted_with_symbol']}\n`;
        return resultString.trim();
      };
  
  let aa = false;
  const submitForm = async (e) => {
    //e.preventDefault();
    if (!aa){
    const orderSummary = generateOrderSummary(cart);
    console.log('mail from mail: ',email,orderSummary);

    const params = {
      TableName: process.env.TABLE_NAME,
      Item: {
        email: email,
      }
    };

    try {
      // Save email to DynamoDB
      await dbClient.put(params).promise();
      console.log("Successfully saved to DynamoDB");

      // Send confirmation email
      const confirmationParams = {
        Source: process.env.REACT_APP_MAIL,
        Destination: {
          ToAddresses: [email]
        },
        Message: {
          Subject: {
            Data: `Order Confirmation - ${cart.payment.stripe.payment_method_id}`
          },
          Body: {
            Text: {
              Data: `Thank you for placing your order!\nYour Order Summary:\n\n${orderSummary}`
            }
          }
        }
      };
      await ses.sendEmail(confirmationParams).promise();
      console.log("Email sent successfully");
    } catch (err) {
      console.error("Error:", err);
    }
  };
  }
  aa = true;
  React.useEffect(() => {
    if (email && cart) {
      submitForm();
    }

  }, [email, cart]);

  return null;
};

export default Mail;
