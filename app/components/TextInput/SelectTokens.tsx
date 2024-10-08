import React, { useEffect, useState } from "react";
import Select from "react-select";

type Token = {
  id: string;
  symbol: string;
  image: string;
};
interface SelectTokenProps {
  tokenHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SelectToken: React.FC<SelectTokenProps> = ({ tokenHandler }) => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [defaultToken, setDefaultToken] = useState<Token | null>(null);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd"
        );
        const data = await response.json();
        const tokenData = data.map((token: any) => ({
          id: token.id,
          symbol: token.symbol.toUpperCase(),
          image: token.image,
        }));
        setTokens(tokenData);
        setDefaultToken(tokenData[0]);
      } catch (error) {
        console.error("Error fetching tokens:", error);
      }
    };

    fetchTokens();
  }, []);

  const customStyles = {
    option: (provided: any) => ({
      ...provided,
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "flex-start",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
    }),
  };

  const formatOptionLabel = ({ symbol, image }: Token) => (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-start",
      }}
    >
      <img
        src={image}
        alt={symbol}
        style={{ width: "20px", marginRight: "10px" }}
      />
      {symbol}
    </div>
  );

  return (
    <Select
      options={tokens}
      getOptionLabel={(token) => token.symbol}
      getOptionValue={(token) => token.symbol}
      formatOptionLabel={formatOptionLabel}
      styles={customStyles}
      //placeholder="Select a Token"
      isSearchable={true}
      defaultValue={defaultToken}
      name="tokenSelling"
      //@ts-ignore
      onChange={tokenHandler}
    />
  );
};

export default SelectToken;
