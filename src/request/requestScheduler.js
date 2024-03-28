class Queue {
  tasks = [];

  enqueue(task) {
    this.tasks.push(task);
  }
  dequeue() {
    return this.tasks.shift();
  }
  size() {
    return this.tasks.length;
  }
}

export class RequestScheduler {
  requests = new Queue();
  // 最大并发数量
  maxConcurrentNum;
  // 记录当前已经发送但未完成的请求数量
  currentRequestNum = 0;
  // 失败最大尝试次数
  maxRetryNum;
  constructor(maxConcurrentNum = 2, maxRetryNum = 3) {
    this.maxConcurrentNum = maxConcurrentNum;
    this.maxRetryNum = maxRetryNum;
  }

  addRequest(request) {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    // this.requests.enqueue(request);
    this.requests.enqueue([request, resolve, reject]);
    this.next();
    return promise;
  }

  async sendRequest(request, maxRetryNum) {
    try {
      const res = await request();
      return res;
    } catch (error) {
      if (maxRetryNum > 0) {
        this.sendRequest(request, maxRetryNum - 1);
      } else {
        throw error;
      }
    }
  }

  async next() {
    if (this.requests.size() > 0) {
      if (this.currentRequestNum < this.maxConcurrentNum) {
        this.currentRequestNum++;
        const [request, resolve, reject] = this.requests.dequeue();
        // await request();
        try {
          const res = await this.sendRequest(request, this.maxRetryNum);
          resolve(res);
        } catch (error) {
          reject(error);
        }
        this.currentRequestNum--;
        this.next();
      }
    }
  }
}
