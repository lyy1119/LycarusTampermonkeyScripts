// ==UserScript==
// @name         Video Pause Override Toggle
// @namespace    https://example.com/
// @version      1.0
// @description  Toggle video pause() override to prevent webpages from auto-pausing
// @match        https://buaa.yuketang.cn/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    const proto = HTMLMediaElement.prototype;

    // 保存原始 pause()
    const originalPause = proto.pause;

    let blockPause = false;

    // 重写后的 pause()
    function overriddenPause() {
        if (blockPause) {
            console.log('[Video Override] pause() blocked');
            return;
        }

        return originalPause.call(this);
    }

    // 创建按钮
    function createButton() {
        const button = document.createElement('button');

        button.textContent = '防暂停：关闭';

        Object.assign(button.style, {
            position: 'fixed',
            right: '20px',
            bottom: '20px',
            zIndex: '2147483647',
            padding: '8px 14px',
            border: 'none',
            borderRadius: '6px',
            background: '#666',
            color: '#fff',
            fontSize: '14px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
        });

        button.addEventListener('click', function () {
            toggle();
        });

        document.documentElement.appendChild(button);

        return button;
    }

    let button = null;

    // 更新按钮状态
    function updateButton() {
        if (!button) return;

        if (blockPause) {
            button.textContent = '防暂停：开启';
            button.style.background = '#d33';
        } else {
            button.textContent = '防暂停：关闭';
            button.style.background = '#666';
        }
    }

    // 开启
    function enable() {
        if (blockPause) return;

        blockPause = true;
        proto.pause = overriddenPause;

        updateButton();

        console.log('[Video Override] 已开启');
    }

    // 关闭并恢复原始 pause()
    function disable() {
        if (!blockPause) return;

        blockPause = false;
        proto.pause = originalPause;

        updateButton();

        console.log('[Video Override] 已恢复');
    }

    // 切换
    function toggle() {
        if (blockPause) {
            disable();
        } else {
            enable();
        }
    }

    // 暴露给控制台
    window.videoPauseOverride = {
        enable,
        disable,
        toggle,
        get enabled() {
            return blockPause;
        }
    };

    // document-start 时 body 可能还不存在
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            button = createButton();
            updateButton();
        });
    } else {
        button = createButton();
        updateButton();
    }

})();
