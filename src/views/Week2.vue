<template>
  <div id="report">
    <div class="global-nav fixed-top">
      <div id="container">
        <div class="navbar">
          <div id="left-nav">
            <router-link class="navText" to="/">Jonathan Hellberg</router-link>
            <router-link class="navText" to="/reports/week/1">Week 1</router-link>
            <router-link class="navText" to="/reports/week/2">Week 2</router-link>
          </div>
          <div id="right-nav">
          </div>
        </div>
      </div>
    </div>
    <a href="https://github.com/jonathan0902/JSRamverk">
      <h4>GitHub</h4>
    </a>
    <p class="simple">
        Input text desigen hittade insperation från Material Design. Tanken var att ta användning av deras design mer men ett problem upstod. Jag lyckades inte lösa
        varför det blev en röd border när email inte var uppfylld men denna dök inte upp när requried fungerade. Har försökte med :invalid :require och andra men hitta
        inte lösnigen. Date pickern ville jag ha ganska simple design eftersom det var för att kunna registera sig snabbt och simpelt. Date pickern tar sig anvädning av skott år.
    </p>
  </div>
</template>

<script>
import MarkdownItVue from 'markdown-it-vue';
import 'markdown-it-vue/dist/markdown-it-vue.css';
import * as file from 'raw-loader!./../../README.md';

export default {
  components: {
    MarkdownItVue,
  },
  data() {
    return {
      content: file.default,
    };
  },
};
</script>

<style scoped>

    .simple {
        width: 500px;
        margin: auto;
    }

    #report {
        height: 100%;
        width: 100%;
        text-align: center;
    }

    #container {
        display: flex;
        flex-wrap: nowrap;
        justify-content: flex-start;
        margin-right: auto;
        margin-left: auto;
        padding-right: 15px;
        padding-left: 15px;
        width: 100%;
        max-width: 1140px;
        align-items: center;
        justify-content: space-between;
        padding: .5rem 1rem;
    }

    .global-nav {
        display: flex;
        flex-wrap: nowrap;
        justify-content: flex-start;
        height: 120px;
    }

    .fixed-top {
        position: relative;
        top: 0;
        right: 0;
        left: 0;
        z-index: 40;
    }

    .navText, .navText:hover {
        font-size: 1em;
        color: black;
        font-family: 'Gravity-Regular';
        text-decoration: none;
        padding-right: 10px;
        padding-left: 10px;
    }

    .navbar {
        display: flex !important;
        flex-basis: 100%;
        align-items: center;
    }

    #left-nav {
    display: flex;
    margin-right: auto !important;
    }

    #right-nav {
    display: flex;
    flex-direction: row;
    padding-left: 0;
    margin-bottom: 0;
    }
</style>