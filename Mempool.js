const bitcoinMessage = require('bitcoinjs-message'); 

const TimeoutRequestsWindowTime = 5*60*1000;

class Mempool {

    constructor() {
        this.mempool = [];
        this.timeoutRequests = [];
        this.mempoolValid = [];
    }

    setTimeout(address){
        var self = this;
        var now =new Date().getTime().toString().slice(0,-3);
        var requestObject = this.mempool[address];
        if(!requestObject){
            self.timeoutRequests[address]=
                setTimeout(() => self.removeValidationRequest(address), TimeoutRequestsWindowTime);
            requestObject= {};
            requestObject["walletAddress"] = address;
            requestObject["requestTimeStamp"] = now;
            requestObject["message"] = `${address}:${now}:startRegistry`;
            requestObject["validationWindow"] = 300;
            self.mempool[address] = requestObject;
            
        } else {
            console.log(`An validation request exists already for the address:${requestObject.walletAddress}`);
            requestObject["validationWindow"] = this.computeTimeLeft(now,requestObject.requestTimeStamp,TimeoutRequestsWindowTime);
        }
        return requestObject;
    }

    validateRequest(signedRequest){
        var request = this.mempool[signedRequest.address];
        let validRequest = {};
        if(request){
            var now =new Date().getTime().toString().slice(0,-3);
            var timeLeft = this.computeTimeLeft(now, request.requestTimeStamp,TimeoutRequestsWindowTime);
            if(timeLeft > 0){
                request.validationWindow= timeLeft;
                let isValid = bitcoinMessage.verify(request.message, signedRequest.address, signedRequest.signature);
                validRequest["status"] = {...request, "messageSignature": isValid};
                validRequest["registerStar"] =  isValid;
                if(isValid){
                    //remove from mempool and the clear the timer handler
                    this.removeValidationRequest(signedRequest.address);
                    //add to the new mempool valid requests
                    this.mempoolValid[signedRequest.address] = validRequest;
                } else {
                    console.log(`Signature ${signedRequest.signature} is not valid`);
                }

                return validRequest;
            } else {

                return false;
            }
        } else {
            return false;
        }
    }

    verifyAddressForValidRequest(address){
        return this.mempoolValid[address];
    }

    removeValidationRequest(address){
        console.log(`Removing validation request :${address} from the mempool`);
        clearTimeout(this.timeoutRequests[address]);
        delete this.mempool[address];
        delete this.timeoutRequests[address];
    }

    removeValideRequest(address){
        delete this.mempoolValid[address];
    }

    computeTimeLeft(now, creation, limit){
        let timeElapse = now - creation;
        let timeLeft = (limit/1000) - timeElapse;
        timeLeft = timeLeft <0 ? 0 : timeLeft;
        return timeLeft;
    }
}

module.exports.Mempool = Mempool;
