- Detailed docs to understand how these so popular stock - trading platform works, system design/architecture.
- How the so called Demand & Supply actually works with real world users.
- How to build a low latency system.
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




