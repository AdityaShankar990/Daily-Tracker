(function () {
    if (document.getElementById('__css_ui'))
        return;
    const s = document.createElement('style');
    s.id = '__css_ui';
    s.textContent = `
        .modal-bg {
            position: fixed;
            inset: 0;
            z-index: 50;
            background: rgba(13,13,15,.82);
            display: none;
            align-items: flex-end;
            justify-content: center;
            backdrop-filter: blur(4px);
            padding: 0;
        }

        .modal-bg.open {
            display: flex;
        }

        .modal {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 14px 14px 0 0;
            padding: 24px 20px;
            width: 100%;
            max-width: 500px;
            animation: slideUp .25s ease;
            max-height: 90vh;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
        }

        @keyframes slideUp {
            from {
				transform: translateY(100%);
			}
            to {
				transform: none;
			}
        }

        @keyframes up {
            from {
				opacity: 0;
				transform: translateY(16px);
			}
            to {
				opacity: 1;
				transform: none;
			}
        }

        .modal-title {
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 18px;
        }

        .row2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }

        @media (min-width: 600px) {
            .modal-bg {
				align-items: center;
				padding: 16px;
			}
            .modal {
				border-radius: 12px;
				animation: up .22s ease;
			}
        }

        @media (max-width: 560px) {
            .week-grid {
				gap: 3px;
			}
            .bar {
				width: 14px;
			}
            .row2 {
				grid-template-columns: 1fr;
			}
        }

        @media (max-width: 400px) {
            .timer-clock {
				font-size: 36px;
				letter-spacing: -1px;
			}
        }

        .confirm-bg {
            position: fixed;
            inset: 0;
            z-index: 100;
            background: rgba(13,13,15,.7);
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(4px);
            animation: fadeIn .15s ease;
        }

        @keyframes fadeIn {
            from {
				opacity: 0;
			}
            to {
				opacity: 1;
			}
        }

        .confirm-box {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 14px;
            padding: 24px 22px 18px;
            width: min(320px, 90vw);
            box-shadow: 0 12px 48px rgba(0,0,0,.5);
            animation: up .18s ease;
        }

        .confirm-msg {
            font-size: 14px;
            font-weight: 600;
            color: var(--text);
            margin-bottom: 18px;
            line-height: 1.5;
        }

        .confirm-btns {
            display: flex;
            gap: 8px;
            justify-content: flex-end;
        }

        .ro-blocked {
            pointer-events: none;
            user-select: none;
        }

        .ro-blocked input,
        .ro-blocked select,
        .ro-blocked button,
        .ro-blocked textarea {
            opacity: 0.4;
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(s);
})();

function showConfirm(msg, onOk, okLabel) {
    const bg = document.createElement('div');
    bg.className = 'confirm-bg';
    bg.innerHTML = `<div class="confirm-box">
						<div class="confirm-msg">${msg}</div>
						<div class="confirm-btns">
							<button class="btn sm" id="_confirmCancel">Cancel</button>
							<button class="btn sm danger" id="_confirmOk">${okLabel || 'Delete'}</button>
						</div>
					</div>`;
    document.body.appendChild(bg);
    const close = () => document.body.removeChild(bg);
    bg.querySelector('#_confirmCancel').onclick = close;
    bg.querySelector('#_confirmOk').onclick = () => {
        close();
        onOk();
    };
    bg.addEventListener('click', e => {
        if (e.target === bg)
			close();
    });
}