// O(N)
for (let i = 0; i < data.length ; i++) {
    console.log(i.toString() + ": " + data[i])

    let params = {
        QueueUrl: queueUrl,
        MessageBody: data[i],
        MessageAttributes: {
            MessageDeduplicationId: {
                DataType: "String",
                StringValue: data[i],
            },
        },
    }
    try {
        await sqs.sendMessage(params).promise()
            .then(data => {
                responseData.push({
                    status: 'Success',
                    data,
                })
            }).catch(data => {
                responseData.push({
                    status: 'Failure',
                })
            })
    }catch(err) {
        console.log(err)
    }
}