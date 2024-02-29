"use client";
import "./cards.scss";
import {
  resetPocemons,
  pocemonsStore,
  getPocemonFx,
} from "@/store/pocemonsStore";
import React, { useEffect, useState } from "react";
import { useUnit } from "effector-react";
import FetchCard from "@/components/fetchCard/fetchCard";
import {
  getPocemonSearchFx,
  pocemonsSearchStore,
  resetPocemonsSearch,
} from "@/store/pokemonSearchStore";

export default function About() {
  const pokemons = useUnit({
    pokemons: pocemonsStore,
    getPokemonFx: getPocemonFx,
  });

  const pokemonsSearch = useUnit({
    pokemonsSearch: pocemonsSearchStore,
    getPokemonSearchFx: getPocemonSearchFx,
  });

  const MaxPocemons = 9;
  const byPocemons = 600;
  const countPage = Math.ceil(byPocemons / MaxPocemons);

  const [PokenonsArr, setPokenonsArr] = useState([]);
  const [BtnPage, setBtnPage] = useState([]);

  const firstArrPokemon = async () => {
    //resetPocemons();
    const newList = await pokemons.getPokemonFx(0);
    setPokenonsArr(newList);
  };

  useEffect(() => {
    firstArrPokemon();
    cteateBtnPage();
  }, []);

  useEffect(() => {
    pokemonsSearch.getPokemonSearchFx();
  }, [pokemonsSearch.getPokemonSearchFx]);

  const cteateBtnPage = () => {
    const arr = [];
    let page = 0;
    for (let i = 0; i < countPage; i++) {
      arr.push(page);
      page += 9;
    }
    setBtnPage(arr);
  };

  const render = async (i: number) => {
    resetPocemons();
    //resetPocemonsSearch();
    await pokemons.getPokemonFx(i);
    setPokenonsArr(pokemons.pokemons);
    console.log(PokenonsArr);
  };

  const search = async (query, pokemonsSearch) => {
    if (!query) {
      firstArrPokemon();
      cteateBtnPage();
      return;
    }
    setBtnPage([]);
    return pokemonsSearch.filter((pokemon) => pokemon.name.includes(query));
  };

  const hendleChenge = async (e) => {
    const newList = await search(e.target.value, pokemonsSearch.pokemonsSearch);
    console.log(e.target.value);
    setPokenonsArr(newList);
    console.log(PokenonsArr);
  };

  return (
    <>
      <div className="container">
        <h1 className="contText">
          603 <b>Pokemons</b> for you to choose your favorite
        </h1>
        <div className="wrapper_input">
          <input
            className="input"
            placeholder="Encuentra tu pokémon..."
            onChange={(e) => {
              hendleChenge(e);
            }}
          />
        </div>
        <div className="wrapper_card">
          {/* {pokemons.pokemons ? (
            pokemons.pokemons.map((item: any, i: number) => {
              return <FetchCard pokemonUrl={item.url} key={i} />;
            })
          ) : (
            <Spiner />
          )} */}
          {PokenonsArr
            ? PokenonsArr.map((item: any, i: number) => {
                return <FetchCard pokemonUrl={item.url} key={i} />;
              })
            : null}
        </div>
        <div className="wrapper_btnPage">
          {BtnPage.map((item: any) => (
            <button
              key={item}
              className="btn_page"
              onClick={() => {
                render(item);
              }}
            ></button>
          ))}
        </div> 
      </div>
    </>
  );
}
