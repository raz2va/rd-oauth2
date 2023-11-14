const express = require('express')
const router = express.Router()

router.get('/nomenclature/:placeId/composition', (req,res) => {
  const payload = {
    "categories": [
      {
        "id": "326",
        "parentId": null,
        "name": "Молоко",
        "sortOrder": 0,
        "images": [

        ]
      }
    ],
    "items": [
      {
        "id": "100234",
        "vendorCode": "22331",
        "categoryId": "326",
        "location": "Бакалея. Линия 8",
        "name": "Молоко Домик в деревне",
        "description": {
          "general": "",
          "composition": "молоко нормализованное (молоко цельное, молоко обезжиренное)",
          "nutritionalValue": "600 ккал, 8 белки, 3,2 жиры, 40 углеводы",
          "purpose": "",
          "storageRequirements": "от -5 до 5 градусов",
          "expiresIn": "60",
          "vendorCountry": "Россия",
          "packageInfo": "Тетрапак",
          "vendorName": "ООО Молочный завод"
        },
        "price": 189,
        "oldPrice": 239,
        "vat": 20,
        "barcode": {
          "value": "987654321098",
          "values": [
            [
              "987654321098",
              "987654321099",
              "987654321000"
            ]
          ],
          "type": "ean13",
          "weightEncoding": "ean13-tail-gram-4"
        },
        "measure": {
          "value": 1000,
          "quantum": 0.3,
          "unit": "GRM"
        },
        "volume": {
          "value": 100,
          "unit": "DMQ"
        },
        "isCatchWeight": false,
        "sortOrder": 0,
        "images": [
          {
            "hash": "lactosefree",
            "url": "https://lactantia.ca/wp-content/uploads/2023/01/lactosefree.jpg",
            "order": 0
          }
        ],
        "labels": [
          "Молоко, Продукты"
        ]
      }
    ]
  }

  res.send(payload)
})

module.exports = router
