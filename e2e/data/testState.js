/**
 * Shared test state across step definitions
 * This module provides a singleton state object that can be used
 * to share data between different step definition files
 */

const state = {
  currentUser: null,
  apiResponse: null,
  apiProducts: null,
  searchResults: null,
  // MCP-specific state
  mcpSnapshot: null,
  pageTitle: null,
  currentUrl: null,
  loginResult: null,
  lastScreenshot: null,
  aiAnalysis: null,
  lastError: null,
};

module.exports = {
  get currentUser() {
    return state.currentUser;
  },
  set currentUser(user) {
    state.currentUser = user;
  },
  get apiResponse() {
    return state.apiResponse;
  },
  set apiResponse(response) {
    state.apiResponse = response;
  },
  get apiProducts() {
    return state.apiProducts;
  },
  set apiProducts(products) {
    state.apiProducts = products;
  },
  get searchResults() {
    return state.searchResults;
  },
  set searchResults(results) {
    state.searchResults = results;
  },
  // MCP-specific getters/setters
  get mcpSnapshot() {
    return state.mcpSnapshot;
  },
  set mcpSnapshot(snapshot) {
    state.mcpSnapshot = snapshot;
  },
  get pageTitle() {
    return state.pageTitle;
  },
  set pageTitle(title) {
    state.pageTitle = title;
  },
  get currentUrl() {
    return state.currentUrl;
  },
  set currentUrl(url) {
    state.currentUrl = url;
  },
  get loginResult() {
    return state.loginResult;
  },
  set loginResult(result) {
    state.loginResult = result;
  },
  get lastScreenshot() {
    return state.lastScreenshot;
  },
  set lastScreenshot(screenshot) {
    state.lastScreenshot = screenshot;
  },
  get aiAnalysis() {
    return state.aiAnalysis;
  },
  set aiAnalysis(analysis) {
    state.aiAnalysis = analysis;
  },
  get lastError() {
    return state.lastError;
  },
  set lastError(error) {
    state.lastError = error;
  },
  reset() {
    state.currentUser = null;
    state.apiResponse = null;
    state.apiProducts = null;
    state.searchResults = null;
    state.mcpSnapshot = null;
    state.pageTitle = null;
    state.currentUrl = null;
    state.loginResult = null;
    state.lastScreenshot = null;
    state.aiAnalysis = null;
    state.lastError = null;
  },
};
