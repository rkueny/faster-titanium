"use strict";

import debug from 'debug'
import { join }  from 'path'
import { existsSync as exists, readFileSync as read } from 'fs'
import chokidar from 'chokidar'
import {EventEmitter} from 'events'
const ____ = debug('faster-titanium:FileWatcher')
const ___x = debug('faster-titanium:FileWatcher:error')

/**
 * Watch files
 */
export default class FileWatcher extends EventEmitter {

    /**
     * @param {string} projDir
     */
    constructor(projDir) {
        super()

        this.projDir = projDir

        this.watcher = chokidar.watch(this.dirs, { persistent: true, ignoreInitial: true })

        this.watcher.on('change', ::this.onChange)
        this.watcher.on('error', path => ___x(path) || this.emit('error', path))
    }

    /**
     * stop watching
     */
    close() {
        this.watcher.close()
        ____(`watch stopped`)
    }



    /**
     * @param {string} path
     */
    onChange(path) {
        if (this.isAlloyPath(path)) {
            this.emit('change:alloy', path)
        }
        else {
            this.emit('change', path)
        }
    }


    isAlloyPath(path) {
        return path.indexOf(join(this.projDir, 'app/')) === 0
    }

    /** @type {string[]} */
    get dirs() {
        return [
            'Resources',
            'app',
            'i18n'
        ]
        .map( name => join(this.projDir, name) )
        .filter (exists)
    }
}
