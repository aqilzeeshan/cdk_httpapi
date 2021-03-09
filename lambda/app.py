from http import HTTPStatus
from json import dumps as json_dumps
from logging import INFO, getLogger
from random import choice
from uuid import uuid4

LOG = getLogger()
LOG.setLevel(INFO)


def lambda_handler(request: dict, _context) -> dict:
    LOG.info("Processing HTTP API request")
    try:
        method, path = request.get("routeKey").split(" ")
    except AttributeError:
        return generate_response(request, "Route key missing in request", HTTPStatus.BAD_REQUEST)

    LOG.info(f"{method} {path} request received")
    response_code, response_body = handle_request(method)

    LOG.info(f"{response_code.value} response received from Order Service")
    return generate_response(request, response_body, response_code)


def generate_response(request: dict, response_body: str, response_code: int) -> dict:
    return {
        "body": response_body,
        "isBase64Encoded": request["isBase64Encoded"],
        "headers": request["headers"],
        "statusCode": response_code
    }


def handle_request(method: str) -> (int, str):
    response_choices = [HTTPStatus.BAD_REQUEST, HTTPStatus.INTERNAL_SERVER_ERROR]

    additional_response_codes = {
        "GET": [HTTPStatus.NOT_FOUND, HTTPStatus.OK],
        "POST": [HTTPStatus.CREATED],
        "PUT": [HTTPStatus.NOT_FOUND, HTTPStatus.OK]
    }

    response_choices += additional_response_codes.get(method) or []
    response_code = choice(response_choices)

    response_bodies = {
        HTTPStatus.BAD_REQUEST: "Bad request received",
        HTTPStatus.CREATED: json_dumps({"orderId": str(uuid4())}),
        HTTPStatus.INTERNAL_SERVER_ERROR: "Internal Order Service error",
        HTTPStatus.NOT_FOUND: "Order not found",
        HTTPStatus.OK: json_dumps({"orderId": str(uuid4())})
    }

    return response_code, response_bodies.get(response_code)
