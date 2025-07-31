- Detailed docs to understand how these so popular stock - trading platform works, system design/architecture.
- How the so called Demand & Supply actually works with real world users.
- How to build a [low latency system](https://www.perplexity.ai/search/what-is-low-latency-in-brief-7rDO.KbQRLW5HBgrnzQK3g).
- Financial terms. Limit order, Orderbook, Maker/Taker etc.

# Low Latency Stock Trading System.

## Exchange functional requirements:
- signup --> KYC via aadhar (we skip this part Or OTP authentication) --> Balance Page (show your balance, add balance, withdraw assets in INR.)

## How does an exchange work:
- users can sign up/in.
- user can place an order.
  1. `limit order`
  2. `Market order`
- user can see their `balances`, their `open orders`.

## Questions must arrive:
- How is the `price` of a stock determined.
- How is the price of real estate determined.

- Ans: Supply & Demand.

## Supply & Demand explanation:
- Let's assume a scenario of a real estate deal, hypothetically assume a building which a buyer whiling of buy at 40 lakhs (according to his/her research), the broker went to the seller with the given price, but the seller want to sell the property for 42 lakhs. 
- `Note` that the property is hot (high demand) in the market right now.
- So, when other buyer see that someone is whiling to pay 40 lakh, they counter the price with 41, 41.5 and so on.
- Here the owner of the property know that, the property in in high demand right now, so he/she might increase the selling price, but let keep it at 42 lakhs for now.
- The moment any buyer whiling to pay 42 lakhs the deal will close.

### Conclusion:
- The above example is a clear explanation of how the actually `orderbook` (digital price book of stock) works with current price.
- This concept works for all assets: real estates, stocks, crypto etc.

## Finance Terms:
1. Orderbook
2. Limit order & Market order
3. Market Depth / Liquidity
4. Maker vs Taker

### Understanding the orderbook:
- [What is Orderbook ? (Click)](https://www.perplexity.ai/search/give-a-brief-of-a-orderbook-in-8pUWbh0kTU.iqKDyvzsnrA)

### what is the price of a stock ?
- The price at which last trade took place (which changes in milli seconds).

### What is a limit order ?
- bitting a (`price`, `qty`) tuple on the on the orderbook.
- usually used by traders and has some trading fee associated with every order that matches.
- our trading fee: `0.03%` per executed order.

### What is a market order ?
- buying a `qty` off the orderbook with the current price.
- usually used by layman/retail, have higher free than limit order.
- usually preceeded by a getQuote request.
- our trading fee: `0.06%` per executed order.

`NOTE`: during the getQuota request, we show a current approx astimate price of a stock, that this much user have to pay, if he/she agrees to the price then the actually `buy request` take place, in case of drastically change in stock price, the order get cancelled. 

### Liquidity/ Market depth ?
- how many orders (price / qty) does the book have.
- can it handle big orders without crashing the price.
- more liquidity = better exchange
- `market makers` provide liquidity.

`NOTE`: when a big order comes, how the price impact will come, how much the market will move based on the single big wave. this can we managed if the orderbook has a good market depth.

### Why would someone provide liquidity ?
- why would someone sit on the middle of the orderbook and wait for the price to come, just to provide the liquidity.
- they are incentivised for this.
- usually done by the `Market makers`.
- the people/firm who do this are the one who make a lot of money. eg: `Citadel`.
- these company some how calculate the current price of the bitcoin the put the bit on both the side, on buyer side a little less then actual price, and on the seller price little more then the actual price, and hence make money on each side.

#### What are the incentives ?
(Accoring to general SLAs, maker price should be b/w -2% to +2% )
1. lesser trading fee.
2. the algorithms in generally biased with the market maker, when it comes to choose the first one to get the deal close having same bit.
3. and more. 

### Maker vs Taker
- the person whose orders exist on the book is called a maker (hence market maker).
- the person who gets their order filled is called taker.
- taker fee is usually higher than maker fee because they take away the liquidity from the book.

## Where does latency matter ?
1. `Exchange` (Software pov)
     - order placement time.
     - time to fetch the orderbook.
     - realtime updates on the orderbook.

2. `Trader` (User pov)
     - order act time.
     - order cancel time.
     - their order priority.

## How is latency made better for the exchange ?
- using faster programming languages. C, `Cpp` etc.
- faster serialization/ deserilization of data. (use `nlohmann/json`)
- inn memory orderbook. (but make sure to keep the backup)

## How is latency made better for a trader/Market maker ?
- being closer to the trading server.
- having multiple co
- faster seriazation / deserialization.
- faster oracles / prediction models.

## Building an Exchange Orderbook:
- We write an orderbook in Cpp.
- Users can
  1. place limit orders
  2. if an order can be executed (partially or completely) it's filled.
  3. users can query the depth chart.
  4. user can get back their balance.
  5. allow users to fitch quotes for market orders
  6. send a market order using the endpoint above.

## HTTP request schema:
- for `/order` endpoint: allow to make a limit order.
{
  side: `BUY/SELL`,
  price: `Number`,
  qty: `Number`,
  userId: `String`
};

- for `/balance` endpoint: show the account balance, and stock balance.
{
  userId: `String`
}

- for `/depth` endpoint: show the orderbook.

- for `/quote` endpoint: get market price, then allow to make a market order.


