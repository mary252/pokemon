import React from 'react';
import axios from 'axios'
import './App.css';

class App extends React.Component{
  state={
    poke_list:[],
    poke_data:[]
  }
  async componentDidMount(){
    axios.get("https://pokeapi.co/api/v2/pokemon/?limit=50").then( res =>{
      console.log(res)
      this.setState({
        poke_list:res.data.results
      })
    }).catch(err =>{
      console.log(err)
    })
  }
  fetchPokemonData= (index, url)=>{
    let{poke_data}=this.state
    let pokemon=poke_data.filter(poke =>poke.index==index)
    console.log(pokemon)
    let acc=pokemon.length===0?
      axios.get(url).then( res =>{
        console.log(res)
        poke_data.push({
          index:index,
          name:res.data.forms[0].name,
          pic:res.data.sprites.front_default,
          states:res.data.stats,
        })
      }).catch(err =>{
        console.log(err)
      }):null
  }
  draw_list=()=>{
   return this.state.poke_list.map((pokemon,i)=>
      <div onMouseEnter={()=>this.fetchPokemonData(i,pokemon.url)} className="list-entry columns" key={i}>
        <div className="column is-2">
          {i}
        </div>
        <div className="column is-5">
          {pokemon.name}
        </div>
      </div>
    )
  }
  render(){
    return (
      <div className="container">
        
        <div className="header">
          <img className="header-pic" src={require("./assets/Pokémon_logo.svg")}/>
        </div>
        <p className="label">Pokemons</p>
        <div className="box columns">
          <div className="column is-8">
            {this.draw_list()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
