import React from 'react';
import axios from 'axios'
import { RingLoader } from 'react-spinners';
import './App.css';
import { thisExpression } from '@babel/types';

class App extends React.Component{
  state={
    poke_list:[],
    poke_data:[],
    current_pokemon_display:null,
    loading:true,
    chain:null,
    showEvolution:false,
    name:null,
    disabled:true
  }
  async componentDidMount(){
    this.setState({
      loading:true
    })
    axios.get(`${process.env.REACT_APP_URL}/pokemon/?limit=30`).then( res =>{
      //console.log(res)
      this.setState({
        poke_list:res.data.results
      })
    }).catch(err =>{
      console.log(err)
    })
    this.setState({
      loading:false
    })
  }
  fetchPokemonData= (index, url)=>{
    let{poke_data}=this.state
    let pokemon=poke_data.filter(poke =>poke.index==index)
    let acc=pokemon.length===0?
      axios.get(url).then( res =>{
        poke_data.push({
          index:index,
          name:res.data.forms[0].name,
          pic:res.data.sprites.front_default,
          states:res.data.stats,
          id:res.data.id
        })
      }).catch(err =>{
        console.log(err)
      }):null
  }
  draw_state= (states) =>{
   return states.map((stat,i)=>
    <div className="columns" key={i}>
      <div className="column is-6">{stat.stat.name}</div>
      <div className="column is-3">{stat.base_stat}</div>
    </div>
    )
  }
  FetchEvolution= async (id) =>{
    axios.get(`${process.env.REACT_APP_URL}/evolution-chain/${id}`).then(res =>{
      
      this.setState({
        chain:res.data.chain,
        disabled:false
      })
    })
  }
  showEvolution=()=>{
    let {chain}=this.state
    console.log(chain)
    return chain.evolves_to !=null && chain.evolves_to.length>0?
     <div className="">
      <p>{this.state.name}  </p>
      {this.continueEvolution(chain.evolves_to[0])}
    </div>:
    <div>no evolution</div>
  }
  continueEvolution=(chain)=>{
  return <p>{chain.species.name }
  {
    chain.evolves_to !=null && chain.evolves_to.length>0?
      this.continueEvolution(chain.evolves_to[0]):null
    
  }
  </p>
  }
  DisplayPokemon=( )=>{
    let pokemon=this.state.current_pokemon_display[0]
    //console.log(pokemon)
    this.FetchEvolution(pokemon.id)
    
    return <div className="states is-flex aic">
        <img className="pokemon-pic" src={pokemon.pic}/>
        <p className="pokemon-name">{pokemon.name}</p>
        {this.draw_state(pokemon.states)}
        <button className="evolution-button" onClick={()=>this.setState({
          showEvolution:true,
          name:pokemon.name
        })
        }
        disabled={this.state.disabled}>Show Evolution</button>
      </div>
  }
  draw_list=()=>{
   return this.state.poke_list.map((pokemon,i)=>
      <div 
        onMouseEnter={()=>this.fetchPokemonData(i,pokemon.url)} 
        onClick={()=> this.listClick(i)}
        className="list-entry columns"
        key={i}>
        <div className="column is-2">
          {i}
        </div>
        <div className="column is-5">
          {pokemon.name}
        </div>
      </div>
    )
  }
  listClick = (i) =>{
    let pokemon=this.state.poke_data.filter(poke =>poke.index==i)
    this.setState({
      current_pokemon_display:pokemon,
      showEvolution:false
    })
        
    this.props.history.push(`?pokemon=${pokemon[0].id}`);
  }
  render(){
    let {current_pokemon_display,loading,showEvolution}=this.state
 
    return (
      
        loading?
        <div className="pre-loader">
        <div className='sweet-loading'>
        <RingLoader
          color={'#ef5350'} 
          loading={this.state.loading} 
        />
      </div>
      </div>:
      
      <div className="container">
        
        <div className="header">
          <img className="header-pic" src={require("./assets/Pokémon_logo.svg")}/>
        </div>
        <p className="label">Pokemons</p>
        <div className="box columns">
          <div className="column is-8">
            {this.draw_list()}
          </div>
          <div className="column is-4">
            {current_pokemon_display!=null?
             this.DisplayPokemon():null}
             <div className="is-flex aic">
             {
               showEvolution?this.showEvolution():null
             }
             </div>
          </div>
          
        </div>
      </div>
    );
  }
}

export default App;
