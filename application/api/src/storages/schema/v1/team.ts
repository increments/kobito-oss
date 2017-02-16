module kaita.storages.schema.v2 {
  export var Team ={
    "required": [
      "name",
      "id",
      "_id"
    ],
    "properties": {
      "name": {
        "type": "string"
      },
      "id": {
        "type": "string"
      },
      "_id": {
        "type": "string"
      }
    }
  };
}
