const testData =  {
    "chain": [
        {
            "index": 1,
            "timestamp": 1610025215072,
            "nonce": 100,
            "hash": "0",
            "previousBlockHash": "0",
            "transactions": []
        },
        {
            "index": 2,
            "timestamp": 1610025300475,
            "nonce": 192133,
            "hash": "000073e7d35d35be0861f043cae54db47715fe0d145fd49bd5964140949f2a31",
            "previousBlockHash": "0",
            "transactions": []
        },
        {
            "index": 3,
            "timestamp": 1610025453851,
            "nonce": 151535,
            "hash": "00009eb460141d569a426770fb54ced25260825b17c080079dc0f461569ff589",
            "previousBlockHash": "000073e7d35d35be0861f043cae54db47715fe0d145fd49bd5964140949f2a31",
            "transactions": [
                    {
                    "amount": 12.5,
                    "sender": "00",
                    "recipient": "25bdfef050ea11ebbe7f4772ba89823d",
                    "transactionId": "58c4bd7050ea11ebbe7f4772ba89823d"
                    },
                    {
                    "amount": 20,
                    "sender": "PLAMEoaepto123",
                    "recipient": "JONISPDGSÖ1415",
                    "transactionId": "92f8a47050ea11ebbe7f4772ba89823d"
                    },
                    {
                    "amount": 10,
                    "sender": "PLAMEoaepto123",
                    "recipient": "JONISPDGSÖ1415",
                    "transactionId": "9607e04050ea11ebbe7f4772ba89823d"
                    },
                    {
                    "amount": 30,
                    "sender": "PLAMEoaepto123",
                    "recipient": "JONISPDGSÖ1415",
                    "transactionId": "9905de0050ea11ebbe7f4772ba89823d"
                    }
            ]
        },
            {
            "index": 4,
            "timestamp": 1610025587226,
            "nonce": 104745,
            "hash": "0000e8daf467a9591d35b4a283b53b70ff6f920177f538d844d3f2034be71786",
            "previousBlockHash": "00009eb460141d569a426770fb54ced25260825b17c080079dc0f461569ff589",
            "transactions": [
                    {
                    "amount": 12.5,
                    "sender": "00",
                    "recipient": "25bdfef050ea11ebbe7f4772ba89823d",
                    "transactionId": "b412002050ea11ebbe7f4772ba89823d"
                    },
                    {
                    "amount": 40,
                    "sender": "PLAMEoaepto123",
                    "recipient": "JONISPDGSÖ1415",
                    "transactionId": "dac97fe050ea11ebbe7f4772ba89823d"
                    },
                    {
                    "amount": 50,
                    "sender": "PLAMEoaepto123",
                    "recipient": "JONISPDGSÖ1415",
                    "transactionId": "dde8732050ea11ebbe7f4772ba89823d"
                    },
                    {
                    "amount": 60,
                    "sender": "PLAMEoaepto123",
                    "recipient": "JONISPDGSÖ1415",
                    "transactionId": "e0cb6ed050ea11ebbe7f4772ba89823d"
                    }
            ]
        }
    ],
    "pendingTransactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "25bdfef050ea11ebbe7f4772ba89823d",
    "transactionId": "0391420050eb11ebbe7f4772ba89823d"
    }
    ],
    "currentNodeUrl": "http://localhost:3001",
    "networkNodes": []
    }

    module.exports = testData;