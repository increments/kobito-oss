module kobito.storages.schema.v2 {
  export var Item = {
    "required": [
      "title",
      "body",
      "tags",
      "teamId"
    ],

    "properties": {
      "title": {
        "type": "string"
      },
      "body":{
        "type": "string"
      },
      "tags": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            }
          }
        }
      },
      "teamId": {
        "type": "string"
      },
      "compiled_body": {
        "type": "string"
      },

      "created_at": {
        "type": "number"
      },

      "syncedItemId": {
        "type": ["string", "null"]
      },

      "local_updated_at": {
        "type": ["number", "null"]
      },

      "remote_updated_at": {
        "type": ["number", "null"]
      },

      "synced_at": {
        "type": ["number", "null"]
      },
      "conflict_item": {}
    }
  };
}
