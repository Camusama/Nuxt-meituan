const state = {
  position: ""
}

const mutations = {
  setPosition (state, val) {
    sessionStorage.setItem("city", val);
    state.position = val
  }
}
const getters = {
  city: state => {
    let temp=sessionStorage.getItem('city')
    let city =temp ===null?"":temp.replace('市', '');
    state.position =city
    return city
  }
}

const actions = {
  setPosition: ({ commit }, position) => {
    commit('setPosition', position)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
