const ts = require('typescript');
const fs = require('node:fs');
const { test } = require('node:test');
const assert = require('node:assert/strict');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText,filename);
const slice=require('../src/features/careNotes/careNotesSlice.ts');
const {syncNotesFromAPI,syncStatsFromAPI,addNote}=require('../src/features/careNotes/careNotesThunks.ts');
const reducer=slice.default;
const payload=id=>({notes:[{id,tenant_id:1,facility_id:11,patient_id:'synthetic-001',category:'observation',priority:3,created_at:'2026-01-01T00:00:00Z',created_by:'Demo',note_content:'Synthetic only'}],pagination:{page:2,total_pages:3,total:41,page_size:20}});
test('tenant change clears prior records/facility scope and resets real pagination field',()=>{
 let state=reducer(undefined,{type:'init'});
 state=reducer(state,slice.setPage(2));state=reducer(state,syncNotesFromAPI.pending('old',2));state=reducer(state,syncNotesFromAPI.fulfilled(payload(1),'old',2));state=reducer(state,slice.setFacilityIds([11]));state=reducer(state,slice.setTenantId(2));
 assert.equal(state.pagination.currentPage,1);assert.deepEqual(state.selectedFacilityIds,[]);assert.deepEqual(state.notes,[]);
 state=reducer(state,syncNotesFromAPI.fulfilled(payload(99),'old',2));assert.deepEqual(state.notes,[]);
});
test('out-of-order note responses cannot replace the latest request',()=>{
 let state=reducer(undefined,{type:'init'});state=reducer(state,syncNotesFromAPI.pending('first',1));state=reducer(state,syncNotesFromAPI.pending('second',2));state=reducer(state,syncNotesFromAPI.fulfilled(payload(2),'second',2));state=reducer(state,syncNotesFromAPI.fulfilled(payload(1),'first',1));assert.equal(state.notes[0].id,2);assert.equal(state.pagination.currentPage,2);
});
test('filter change invalidates late statistics and a new result completes loading',()=>{
 let state=reducer(undefined,{type:'init'});state=reducer(state,syncStatsFromAPI.pending('old'));state=reducer(state,slice.setFacilityIds([12]));state=reducer(state,syncStatsFromAPI.fulfilled({total_notes:99},'old'));assert.equal(state.stats,null);state=reducer(state,syncStatsFromAPI.pending('new'));state=reducer(state,syncStatsFromAPI.fulfilled({total_notes:3},'new'));assert.equal(state.stats.total_notes,3);assert.equal(state.statsLoading,false);
});
test('a failed statistics request leaves the note list error untouched',()=>{
 let state=reducer(undefined,{type:'init'});state=reducer(state,syncStatsFromAPI.pending('s1'));state=reducer(state,syncStatsFromAPI.rejected(new Error('down'),'s1'));assert.equal(state.error,null);assert.equal(state.statsError,'Could not load statistics for this selection');state=reducer(state,syncStatsFromAPI.pending('s2'));assert.equal(state.statsError,null);
});
test('a saved note only joins the visible list when it matches the selected scope',()=>{
 const note=(id,facility_id)=>({...payload(id).notes[0],facility_id});
 let state=reducer(undefined,{type:'init'});state=reducer(state,slice.setFacilityIds([11]));
 state=reducer(state,addNote.fulfilled(note(5,12),'a1',{}));assert.equal(state.notes.length,0);
 state=reducer(state,addNote.fulfilled(note(6,11),'a2',{}));assert.equal(state.notes[0].id,6);assert.equal(state.pagination.totalItems,1);
});
