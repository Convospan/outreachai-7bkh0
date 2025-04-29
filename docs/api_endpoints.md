# Product API Endpoints

This document outlines the Product API endpoints, their methods, required OAuth scopes, and permission types.

## Endpoints

| Resource                  | Method   | OAuth Scopes         | Permission Types            | Search |
| ------------------------- | -------- | -------------------- | --------------------------- | ------ |
| /rest/memberAuthorizations | FINDER   | memberAndApplication | r_dma_portability_3rd_party | Search |
| /rest/memberAuthorizations | CREATE   | r_dma_portability_3rd_party | Member (3-legged)          |        |
| /rest/memberChangeLogs   | FINDER   | memberAndApplication | r_dma_portability_3rd_party |        |
| /rest/memberSnapshotData | FINDER   | criteria             | r_dma_portability_3rd_party |        |