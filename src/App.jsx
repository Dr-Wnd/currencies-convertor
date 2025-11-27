import React, { useEffect, useState } from 'react';
import { Block } from './Block';
import './index.css';
import { useCallback } from 'react';

function App() {
  const [fromCurrency, setFromCurrency] = useState("HRN");
  const [toCurrency, setToCurrency] = useState("USD");
  //const [rates, setRates] = useState({});
  const [fromPrice, setFromPrice] = useState(0);
  const [toPrice, setToPrice] = useState(1);

  const ratesRef = React.useRef({})
  useEffect(() => {
  fetch('/assets/exchangerate.json')
    .then((res) => res.json())
    .then((json) => {
      ratesRef.current = json.rates;
      // Trigger re-calculation in another effect
      setToPrice(1); // trigger effect below
    })
    .catch(err => {
      console.warn(err);
      alert('Failed to access exchange rate data');
    });
}, []); // include used values


  const onChangeFromPrice = useCallback((value) => {
    const price = value / ratesRef.current[fromCurrency];
    const result = price * ratesRef.current[toCurrency]  
    setToPrice(result.toFixed(3));
    setFromPrice(value);
    
  }, [fromCurrency, toCurrency]);

const onChangeToPrice = useCallback((value) => {
    const result = (ratesRef.current[fromCurrency] / ratesRef.current[toCurrency]) * value;
    setFromPrice(result.toFixed(3));  
    setToPrice(value);
  }, [fromCurrency, toCurrency]);

useEffect(() => {
  onChangeFromPrice(fromPrice);
}, [fromCurrency, fromPrice, onChangeFromPrice]);

useEffect(() => {
  onChangeToPrice(toPrice);
}, [toCurrency, toPrice, onChangeToPrice]);

  return (
    <div className="App">
      <Block
       value={fromPrice}
       currency={fromCurrency}
       onChangeCurrency={setFromCurrency}
       onChangeValue={onChangeFromPrice}
       />
      <Block
       value={toPrice}
       currency={toCurrency}
       onChangeCurrency={setToCurrency}
       onChangeValue={onChangeToPrice}
      />
    </div>
  );
}

export default App;
