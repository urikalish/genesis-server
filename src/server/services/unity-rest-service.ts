import request from 'request-promise';

class UnityRestService {

  sendPrimaryUnityMessage(event: string, body: string) {
    const url = `http://${process.env.PRIMARY_UNITY_IP}:${
      process.env.PRIMARY_UNITY_PORT
    }/${event}/`;
    console.log('sending to unity 1 to url: ' + url + ', body: ' + body);
    return this.sendMessage(url, body)
      .then(r => console.log(r))
      .catch(e => console.log(e.message));
  }

  sendSecondryUnityMessage(event: string, body: string) {
    const url = `http://${process.env.SECONDRY_UNITY_IP}:${
      process.env.SECONDRY_UNITY_PORT
    }/${event}/`;
    console.log('sending to unity 2 to url: ' + url + ', body: ' + body);
    return this.sendMessage(url, body);
  }

  sendTheardUnityMessage(event: string, body: string) {
    const url = `http://${process.env.THIRD_UNITY_IP}:${
      process.env.THIRD_UNITY_PORT
    }/${event}/`;
    console.log('sending to unity 3 to url: ' + url + ', body: ' + body);
    return this.sendMessage(url, body);
  }

  sendKinectMessage(event: string) {
    const url = `http://${process.env.PRIMARY_UNITY_IP}:${
      process.env.KINECT_IP_PORT
    }/Temporary_Listen_Addresses/${event}/`;
    console.log('sending to kinect: ' + url);
    return request.get({
      url,
    });
  }

  sendMessage(url: string, body: string) {
    return request.post({
      url,
      body,
      headers: {
        'Content-Type': 'text/html'
      }
    });
  }
}

export default new UnityRestService();
