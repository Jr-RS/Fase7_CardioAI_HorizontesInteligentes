# CardioIA - Fase 7 (Horizontes Inteligentes)
# Dispositivo_IoT (MicroPython / Wokwi)
#
# Leitura simulada de sinais vitais (FC, SpO2, PA sistolica) a partir de um
# sensor (potenciometro mapeado), analise local classificando a leitura como
# normal/alterada, feedback visual (LED) quando fora da faixa e envio HTTP POST
# ao endpoint /iot/vitals do Backend_CardioIA.
#
# Payload compativel com IoTVitalIn:
#   { patient_id, heart_rate, spo2, systolic_bp, timestamp? }
#
# Requirements: 6.1, 6.2, 6.3, 6.4

import time

try:
    # Disponiveis no firmware MicroPython (ex.: ESP32 no Wokwi)
    from machine import Pin, ADC
    import urequests
except ImportError:  # Permite import/syntax-check fora do hardware
    Pin = None
    ADC = None
    urequests = None


# ---------------------------------------------------------------------------
# Configuracao
# ---------------------------------------------------------------------------

# URL publica do Backend_CardioIA hospedado no Render.
# Substituir pelo dominio real do servico antes da demonstracao.
API_URL = "https://cardioia-backend.onrender.com"

# Identificador do paciente monitorado por este dispositivo.
PATIENT_ID = 1

# Intervalo entre ciclos de leitura (segundos).
READ_INTERVAL_S = 5

# Faixas de normalidade para a analise local (Requirement 6.2).
SPO2_MIN_NORMAL = 92          # spo2 < 92 -> alterado
HEART_RATE_MAX_NORMAL = 110   # heart_rate > 110 -> alterado
HEART_RATE_MIN_NORMAL = 50    # heart_rate < 50 -> alterado (bradicardia)
SYSTOLIC_BP_MAX_NORMAL = 140  # systolic_bp > 140 -> alterado
SYSTOLIC_BP_MIN_NORMAL = 90   # systolic_bp < 90 -> alterado (hipotensao)

# Pinos de hardware (compativeis com iot/diagram.json no Wokwi).
SENSOR_PIN = 34   # ADC: potenciometro simulando o sensor de sinais vitais
ALERT_LED_PIN = 2  # LED de alerta (acionado quando fora da faixa)


# ---------------------------------------------------------------------------
# Inicializacao de hardware
# ---------------------------------------------------------------------------

def init_sensor():
    """Inicializa o ADC do sensor simulado, se o hardware estiver disponivel."""
    if ADC is None:
        return None
    adc = ADC(Pin(SENSOR_PIN))
    try:
        # ESP32: faixa completa de 0..3.3V -> leitura 0..4095
        adc.atten(ADC.ATTN_11DB)
    except AttributeError:
        pass
    return adc


def init_alert_led():
    """Inicializa o LED de alerta, se o hardware estiver disponivel."""
    if Pin is None:
        return None
    led = Pin(ALERT_LED_PIN, Pin.OUT)
    led.value(0)
    return led


# ---------------------------------------------------------------------------
# Leitura e analise (Requirements 6.1, 6.2)
# ---------------------------------------------------------------------------

def read_raw(sensor):
    """Le o valor bruto do sensor (0..4095). Simula leitura sem hardware."""
    if sensor is not None:
        return sensor.read()
    # Fallback determinístico/variavel para execucao fora do hardware.
    return (time.time() * 37) % 4096


def read_vitals(sensor):
    """Le o sensor e mapeia o valor bruto para sinais vitais simulados.

    Mapeia uma unica leitura analogica (0..4095) para tres sinais vitais
    plausiveis, simulando um sensor multiparametrico.
    """
    raw = read_raw(sensor)
    fraction = raw / 4095.0

    # FC: 45..135 bpm
    heart_rate = int(45 + fraction * 90)
    # SpO2: 85..100 % (inversamente proporcional para variar a condicao)
    spo2 = int(100 - fraction * 15)
    # PA sistolica: 85..160 mmHg
    systolic_bp = int(85 + fraction * 75)

    return heart_rate, spo2, systolic_bp


def analyze_local(heart_rate, spo2, systolic_bp):
    """Classifica a leitura como normal/alterada (Requirement 6.2).

    Retorna (is_abnormal, reasons).
    """
    reasons = []

    if spo2 < SPO2_MIN_NORMAL:
        reasons.append("SpO2 baixo ({}%)".format(spo2))
    if heart_rate > HEART_RATE_MAX_NORMAL:
        reasons.append("FC alta ({} bpm)".format(heart_rate))
    elif heart_rate < HEART_RATE_MIN_NORMAL:
        reasons.append("FC baixa ({} bpm)".format(heart_rate))
    if systolic_bp > SYSTOLIC_BP_MAX_NORMAL:
        reasons.append("PA sistolica alta ({} mmHg)".format(systolic_bp))
    elif systolic_bp < SYSTOLIC_BP_MIN_NORMAL:
        reasons.append("PA sistolica baixa ({} mmHg)".format(systolic_bp))

    return (len(reasons) > 0), reasons


# ---------------------------------------------------------------------------
# Feedback visual (Requirement 6.3)
# ---------------------------------------------------------------------------

def set_alert_feedback(led, is_abnormal):
    """Aciona o LED de alerta quando a leitura esta fora da faixa normal."""
    if led is None:
        return
    led.value(1 if is_abnormal else 0)


# ---------------------------------------------------------------------------
# Envio ao Backend (Requirement 6.4)
# ---------------------------------------------------------------------------

def build_payload(heart_rate, spo2, systolic_bp):
    """Monta o payload compativel com o modelo IoTVitalIn."""
    return {
        "patient_id": PATIENT_ID,
        "heart_rate": heart_rate,
        "spo2": spo2,
        "systolic_bp": systolic_bp,
    }


def send_vitals(payload):
    """Envia os sinais vitais ao endpoint /iot/vitals via HTTP POST.

    Captura excecoes de rede, registra e permite seguir para o proximo ciclo.
    """
    if urequests is None:
        print("[IoT] urequests indisponivel; envio ignorado:", payload)
        return False

    url = "{}/iot/vitals".format(API_URL)
    response = None
    try:
        response = urequests.post(url, json=payload)
        print("[IoT] Enviado:", payload, "-> HTTP", response.status_code)
        return True
    except Exception as exc:  # noqa: BLE001 - resiliencia de demonstracao
        # Requirement 6.4: capturar excecao de rede, registrar e seguir.
        print("[IoT] Falha de rede ao enviar vitals:", exc)
        return False
    finally:
        if response is not None:
            try:
                response.close()
            except Exception:  # noqa: BLE001
                pass


# ---------------------------------------------------------------------------
# Loop principal (Requirement 6.1)
# ---------------------------------------------------------------------------

def run():
    sensor = init_sensor()
    alert_led = init_alert_led()

    print("[IoT] CardioIA iniciado. Enviando para", API_URL)

    while True:
        heart_rate, spo2, systolic_bp = read_vitals(sensor)
        is_abnormal, reasons = analyze_local(heart_rate, spo2, systolic_bp)

        status = "ALTERADO" if is_abnormal else "NORMAL"
        print(
            "[IoT] FC={} bpm | SpO2={}% | PA={} mmHg | {}".format(
                heart_rate, spo2, systolic_bp, status
            )
        )
        if is_abnormal:
            print("[IoT] Alerta:", ", ".join(reasons))

        # Feedback visual quando fora da faixa (Requirement 6.3).
        set_alert_feedback(alert_led, is_abnormal)

        # Envio ao backend ao final do ciclo (Requirement 6.4).
        payload = build_payload(heart_rate, spo2, systolic_bp)
        send_vitals(payload)

        time.sleep(READ_INTERVAL_S)


if __name__ == "__main__":
    run()
