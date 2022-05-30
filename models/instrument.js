const mongoose =require( 'mongoose');
var Schema = mongoose.Schema;

var instrument = new Schema({
  "instrument_token": {
    "type": "Number"
  },
  "exchange_token": {
    "type": "Number"
  },
  "tradingsymbol": {
    "type": "String"
  },
  "name": {
    "type": "String" 
  },
  "last_price": {
    "type": "Number"
  },
  "expiry": {
    "type": "String"
  },
  "strike": {
    "type": "Number"
  },
  "tick_size": {
    "type": "Number"
  },
  "lot_size": {
    "type": "Number"
  },
  "instrument_type": {
    "type": "String"
  },
  "segment": {
    "type": "String"
  },
  "exchange": {
    "type": "String"
  }
});

mongoose.models = {};

var Instrument = mongoose.model('Instrument', instrument,"allStocks");

module.exports = Instrument;