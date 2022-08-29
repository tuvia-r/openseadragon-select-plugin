import './setup'
import { describe, expect, it } from '@jest/globals';
import { Viewer } from 'openseadragon';
import '../src'

describe('plugin tests', () => {
    it('will add select function to Viewer prototype', () => {
        expect(Viewer.prototype.selection).toBeTruthy()
    })
})