# Weather Station API

## Base URL
`http://localhost:3000`

## Endpoints

### POST `/weather`
Create a new weather record.

- **Request Body (JSON or x-www-form-urlencoded)**
    - `temperature` (number, required)
    - `humidity` (number, required)

- **Responses**
    - `201 Created`
        ```json
        { "message": "Data inserted successfully" }
        ```
    - `400 Bad Request` — Invalid or missing parameters.
    - `500 Internal Server Error` — Database or server error.

### GET `/weather`
Retrieve weather records ordered by `timestamp` descending.

- **Responses**
    - `200 OK`
        ```json
        [
            {
                "id": number,
                "temperature": number,
                "humidity": number,
                "timestamp": string
            }
        ]
        ```
    - `500 Internal Server Error` — Database or server error.

## Data Model
- **Table:** `weather_data`
    - `id` (integer, primary key, auto-increment)
    - `temperature` (number, not null)
    - `humidity` (number, not null)
    - `timestamp` (datetime, default current timestamp)