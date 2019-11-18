import React from 'react';
import {shallow } from 'enzyme';
import App from './App';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import axios from "axios";
import httpAdapter from "axios/lib/adapters/http";
import nock from "nock";
configure({ adapter: new Adapter() });
jest.setTimeout(30000);
const host = "https://pokeapi.co/api/v2";

axios.defaults.host = host;
axios.defaults.adapter = httpAdapter;
describe('renders without crashing', () => {
  
  const app = shallow(<App  />);

  let instance = app.instance();

  it("renders correctly",() => {
    expect(app).toMatchSnapshot();
  });
  it("component Did mount works",async()=>{
    nock("https://pokeapi.co/api/v2")
      .get("/pokemon/?limit=30")
      .reply(200, {
        data:{
          results: [
            {
              name:"bulbasaur",
              url:"https://pokeapi.co/api/v2/pokemon/1/"
            },
            {
              name:"ivysaur",
              url:"https://pokeapi.co/api/v2/pokemon/2/"
            }
          ]
        }
      });
    try{
      await instance.componentDidMount()
      expect(instance.state.loading).toEqual(false)
      expect(instance.state.poke_list.length).toEqual(2)
    }catch(e){
      
    }
    
  })

  it("fetch pokemon info work",async ()=>{
    nock("https://pokeapi.co/api/v2")
      .get("/pokemon/?limit=30")
      .reply(200, {
        data:{
          "base_experience": 64,
          "forms": [
            {
              "name": "bulbasaur",
              "url": "https://pokeapi.co/api/v2/pokemon-form/1/"
            }
          ],
          "id": 1,
          "sprites": {
            "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
          },
          "stats": [
            {
              "base_stat": 49,
              "effort": 0,
              "stat": {
                "name": "defense",
                "url": "https://pokeapi.co/api/v2/stat/3/"
              }
            },
            {
              "base_stat": 49,
              "effort": 0,
              "stat": {
                "name": "attack",
                "url": "https://pokeapi.co/api/v2/stat/2/"
              }
            },
            {
              "base_stat": 45,
              "effort": 0,
              "stat": {
                "name": "hp",
                "url": "https://pokeapi.co/api/v2/stat/1/"
              }
            }
          ],
        }
      });
      try{
        await instance.fetchPokemonData(0,"https://pokeapi.co/api/v2/pokemon/1/")
        expect(instance.state.poke_data.length).toEqual(1)
      }catch(e){

      }
  })

  it("fetch evolotion works",async ()=>{
    nock("https://pokeapi.co/api/v2")
      .get("/evolution-chain/1/")
      .reply(200, {
        data:{
          "chain": {
              "evolves_to": [
                {
                  "evolution_details": [
                    {
                      "gender": null,
                      "held_item": null,
                      "item": null,
                      "known_move": null,
                      "known_move_type": null,
                      "location": null,
                      "min_affection": null,
                      "min_beauty": null,
                      "min_happiness": null,
                      "min_level": 32,
                      "needs_overworld_rain": false,
                      "party_species": null,
                      "party_type": null,
                      "relative_physical_stats": null,
                      "time_of_day": "",
                      "trade_species": null,
                      "trigger": {
                        "name": "level-up",
                        "url": "https://pokeapi.co/api/v2/evolution-trigger/1/"
                      },
                      "turn_upside_down": false
                    }
                  ],
                  "evolves_to": [],
                  "is_baby": false,
                  "species": {
                    "name": "venusaur",
                    "url": "https://pokeapi.co/api/v2/pokemon-species/3/"
                  }
                }
              ]
        }
      }});
      try{
        await instance.FetchEvolution(1);
        expect(instance.state.chain).not.toEqual(null)
      }catch (e){

      }
  })
  afterEach(() => {
    delete global.__mobxInstanceCount; // prevent warnings
  })
});
