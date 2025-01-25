import * as functions from "firebase-functions";
import { authentication } from "../../common/authentication";
import { StatusCodes } from "http-status-codes";
import { getCategoryClassification } from "../../common/classifier";

export const classifyCategory = functions
  .region("europe-west1")
  .https.onRequest(async (request, response) => {
    functions.logger.info("classifyToACategory called", {
      structuredData: true,
    });

    const { name, type } = request.body;

    const isAuthenticated = await authentication(request.headers.authorization);
    if (!isAuthenticated) {
      response.statusCode = StatusCodes.UNAUTHORIZED;
      response.send();
    }

    const categoryString = await getCategoryClassification(type, name);
    const categoryArray = categoryString.split("_");

    response.send({
      categoryString,
      category: {
        id: categoryArray[2],
        name: categoryArray[0],
        parent: categoryArray[1],
      },
    });
  });
