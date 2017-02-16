module kaita.storages.schema.v2 {
  export var Team = {
    "required": [
      "_id",
      "name",
      "local"
    ],
    "properties": {
      "_id": {
        "type": "string"
      },
      "name": {
        "type": "string"
      },
      "local": {
        "type": "boolean"
      }
    }
  };
}
