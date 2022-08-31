const makeRequestObject = queueUrl => datum => {
    return {
        QueueUrl: queueUrl,
        MessageBody: datum,
        MessageAttributes: {
            MessageDeduplicationId: {
                DataType: "String",
                StringValue: datum,
            },
        },
    }
}

const makeRequest = requestObj => {
    return sqs.sendMessage(requestObj).promise()
}

const convertSuccessFailture = promise => {
    return promise.then(data => {
        return {
            status: 'Success',
            data,
        }
    }).catch(_ => {
        return {
            status: 'Failure'
        }
    })
}

// => [Success | Failure]
// O(3N)
const getResponsePromises = data =>
    data
        // [messageBody] -> [request obj]
        .map(makeRequestObject("Http://..."))
        // [requestObj] -> [promise http response]
        .map(makeRequest)
        // [Promise http response] -> [Promise Success | Failure]
        .map(convertSuccessFailture)




    const promiseAll = toEither(Promise.all(getResponsePromises(data)))
    // => Promise [Success | Failure]

    const responseData = await promiseAll
    // => [Success | Failure]

