import {Writable} from "readable-stream";
import promiseToCallback from "promise-to-callback";


export default function createStreamSink (asyncWriteFn, _opts) {
  return new AsyncWritableStream(asyncWriteFn, _opts);
}

class AsyncWritableStream extends Writable {

  constructor (asyncWriteFn, _opts) {
    const opts = Object.assign({objectMode: true}, _opts);
    super(opts);
    this._asyncWriteFn = asyncWriteFn;
  }

  // write from incomming stream to state
  _write (chunk, encoding, callback) {
    promiseToCallback(this._asyncWriteFn(chunk, encoding))(callback);
  }

}
