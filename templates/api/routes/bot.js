var resource=require('./util/resource')
var lambda=require('./util/lambda')
var fs=require('fs')

module.exports={
"Bot": resource('bot'),
"UtterancesApi": resource('utterances',{"Ref":"Bot"}),
"BotPost":lambda({
    authorization:"AWS_IAM",
    method:"post",
    template:fs.readFileSync(__dirname+'/templates/bot.post.vm','utf8'),
    lambda:{"Fn::GetAtt":["LexBuildLambda","Arn"]},
    resource:{"Ref":"Bot"},
    parameterNames:{"integration.request.header.X-Amz-Invocation-Type":"'Event'"},
    responseTemplate:fs.readFileSync(__dirname+'/templates/bot.post.resp.vm','utf8')
}),
"BotGet":lambda({
    authorization:"AWS_IAM",
    method:"get",
    template:fs.readFileSync(__dirname+'/templates/bot.get.vm','utf8'),
    lambda:{"Fn::GetAtt":["LexProxyLambda","Arn"]},
    resource:{"Ref":"Bot"},
    responseTemplate:fs.readFileSync(__dirname+'/templates/bot.get.resp.vm','utf8')
}),
"UtterancesGet":lambda({
    authorization:"AWS_IAM",
    method:"get",
    lambda:{"Fn::GetAtt":["LexProxyLambda","Arn"]},
    template:fs.readFileSync(__dirname+'/templates/utterance.get.vm','utf8'),
    responseTemplate:fs.readFileSync(__dirname+'/templates/utterance.get.resp.vm','utf8'),
    resource:{"Ref":"UtterancesApi"}
}),
"BotDoc":{
    "Type" : "AWS::ApiGateway::DocumentationPart",
    "Properties" : {
        "Location" : {
            "Type":"RESOURCE",
            "Path":"/bot"
        },
        "Properties" :JSON.stringify({
           description:""  
        }),
        "RestApiId" : {"Ref":"API"}
    }
}
}


