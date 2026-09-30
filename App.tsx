import { useEffect, useState } from 'react';
import { BookOpen, ChevronDown, Gauge, Lightbulb, Pause, Play, RotateCcw, ShieldCheck, Thermometer, Waves, Wind, FlaskConical } from 'lucide-react';
import boyleWorksheet from '@assets/1_1789848594898.webp';
import temperatureWorksheet from '@assets/2_1789848594898.webp';
import evaporationWorksheet from '@assets/3_1789848594897.webp';

type ExperimentKey = 'boyle' | 'temperature' | 'evaporation';

const experimentInfo: Record<ExperimentKey, { title: string; subtitle: string; icon: typeof Gauge; image: string }> = {
  boyle: { title: 'قانون بويل', subtitle: 'الحجم والضغط عند ثبات درجة الحرارة', icon: Gauge, image: boyleWorksheet },
  temperature: { title: 'حجم الغاز ودرجة الحرارة', subtitle: 'العلاقة عند ثبات الضغط', icon: Thermometer, image: temperatureWorksheet },
  evaporation: { title: 'سرعة التبخر', subtitle: 'كيف تغيّر الحرارة والزمن النتيجة؟', icon: Wind, image: evaporationWorksheet },
};

function Worksheet({ experiment }: { experiment: ExperimentKey }) {
  const item = experimentInfo[experiment];
  return (
    <aside className="worksheet-panel" data-testid={`panel-worksheet-${experiment}`}>
      <h4>من ورقة العمل إلى المختبر</h4>
      <div className="worksheet-frame">
        <img src={item.image} alt={`ورقة عمل تجربة ${item.title}`} data-testid={`img-worksheet-${experiment}`} />
      </div>
      <div>
        <p className="worksheet-caption">المرجع الأصلي للتجربة ظاهر هنا. غيّر المتغيرات في المحاكاة، ثم قارِن ملاحظاتك بالخطوات والجدول.</p>
        <div className="worksheet-label"><BookOpen size={13} /> ورقة النشاط الأصلية</div>
      </div>
    </aside>
  );
}

function ExperimentHeader({ experiment, onReset }: { experiment: ExperimentKey; onReset: () => void }) {
  const item = experimentInfo[experiment];
  const Icon = item.icon;
  return (
    <div className="experiment-head">
      <div className="experiment-title">
        <div className="experiment-title-icon"><Icon size={21} /></div>
        <div><h3>{item.title}</h3><p>{item.subtitle}</p></div>
      </div>
      <button className="reset-button" onClick={onReset} data-testid={`button-reset-${experiment}`}><RotateCcw size={14} /><span>إعادة التجربة</span></button>
    </div>
  );
}

function LabProgress({ step, labels }: { step: number; labels: string[] }) {
  return (
    <div className="lab-progress" aria-label="مراحل التجربة">
      {labels.map((label, index) => (
        <div className={`progress-step ${index <= step ? 'is-active' : ''}`} key={label}>
          <span>{index + 1}</span>
          <small>{label}</small>
        </div>
      ))}
    </div>
  );
}

function ConclusionCard({ observation, conclusion, ready, recorded }: { observation: string; conclusion: string; ready: boolean; recorded: string }) {
  return (
    <div className={`conclusion-card ${ready ? 'is-ready' : ''}`}>
      <div className="conclusion-heading">
        <div className="conclusion-icon"><Lightbulb size={18} /></div>
        <div><span>محطة الاستنتاج</span><h4>{ready ? 'أحسنت، هذه خلاصة ملاحظتك' : 'سجّل أكثر من قراءة لتصل إلى الاستنتاج'}</h4></div>
      </div>
      <div className="conclusion-body">
        <div><span>الملاحظة</span><p>{observation}</p></div>
        <div><span>الاستنتاج العلمي</span><p>{conclusion}</p></div>
      </div>
      <div className="recorded-note"><Waves size={14} /> {recorded}</div>
    </div>
  );
}

function BoyleExperiment() {
  const [volume, setVolume] = useState(20);
  const [readings, setReadings] = useState<number[]>([]);
  const pressure = 600 / volume;
  const inverse = 1 / pressure;
  const volumes = [10, 15, 20, 25, 30, 35, 40];
  const setV = (value: number) => setVolume(Math.min(40, Math.max(10, value || 10)));
  const registerReading = () => setReadings((current) => current.includes(volume) ? current : [...current, volume]);
  const progressStep = readings.length === 0 ? 0 : readings.length === 1 ? 1 : 2;
  const lowest = readings.length ? Math.min(...readings) : volume;
  const highest = readings.length ? Math.max(...readings) : volume;
  const ready = readings.length >= 2;
  return (
    <div className="experiment-grid">
      <div className="simulation-area">
        <LabProgress step={progressStep} labels={['غيّر الحجم', 'سجّل القراءة', 'استنتج']} />
        <div className="control-layout">
          <div>
            <div className="syringe-stage">
              <div className="gauge">{pressure.toFixed(1)} kPa</div>
              <div className="syringe">
                <div className="syringe-nozzle" />
                <div className="syringe-barrel"><div className="syringe-gas" style={{ width: `${((volume - 10) / 30) * 76 + 18}%` }} /><div className="syringe-ticks" /></div>
                <div className="syringe-plunger" style={{ transform: `translateX(-${(40 - volume) * 1.25}px)` }} />
              </div>
            </div>
            <div className="chart-box">
              <div className="chart-title"><span>سجل القياسات</span><span className="chart-legend"><i style={{ color: 'hsl(37 75% 61%)' }}>■</i> الحجم&nbsp; <i style={{ color: 'hsl(8 70% 60%)' }}>■</i> الضغط</span></div>
              <div className="bars">{volumes.map((v) => <div className="bar-column" key={v}><div className="bar volume" style={{ height: `${(v / 40) * 75}%` }} /><div className="bar pressure" style={{ height: `${(600 / v / 6) * 75}%` }} /></div>)}</div>
              <div className="chart-labels">{volumes.map((v) => <span key={v}>{v}</span>)}</div>
            </div>
          </div>
          <div className="control-card">
            <h4>اسحب مكبس المحقن واختبر العلاقة</h4>
            <div className="label-row"><span>حجم الغاز</span><span className="value-pill" data-testid="value-volume">{volume} mL</span></div>
            <input type="range" min="10" max="40" step="5" value={volume} onChange={(event) => setV(Number(event.target.value))} data-testid="input-volume-slider" />
            <div className="range-scale"><span>10 mL</span><span>40 mL</span></div>
            <input className="number-input" type="number" min="10" max="40" step="5" value={volume} onChange={(event) => setV(Number(event.target.value))} aria-label="حجم الغاز بالمليلتر" data-testid="input-volume-number" />
            <button className="record-button" onClick={registerReading} data-testid="button-record-boyle"><BookOpen size={15} /> سجّل هذه القراءة</button>
            <div className="result-grid">
              <div className="result-tile"><span>الضغط</span><strong data-testid="value-pressure">{pressure.toFixed(1)} kPa</strong></div>
              <div className="result-tile"><span>1 ÷ الضغط</span><strong data-testid="value-inverse">{inverse.toFixed(3)}</strong></div>
              <div className="result-tile"><span>ثابت التجربة</span><strong>600</strong></div>
            </div>
            <div className="reading-list">
              <span>القراءات المسجلة</span>
              <div>{readings.length ? readings.map((reading) => <b key={reading}>{reading} mL</b>) : <em>لم تُسجّل قراءة بعد</em>}</div>
            </div>
          </div>
        </div>
        <ConclusionCard
          ready={ready}
          observation={ready ? `عند تقليل الحجم من ${highest} mL إلى ${lowest} mL ارتفع الضغط من ${(600 / highest).toFixed(1)} إلى ${(600 / lowest).toFixed(1)} kPa.` : 'حرّك المكبس بين قيمتين مختلفتين، ثم سجّل كل قراءة للمقارنة.'}
          conclusion={ready ? 'عند ثبات درجة الحرارة، يتناسب ضغط الغاز عكسياً مع حجمه؛ كلما قلّ الحجم زاد الضغط، ويبقى حاصل الضرب قريباً من ثابت التجربة.' : 'البيانات لم تكتمل بعد. اجمع قراءتين على الأقل قبل كتابة الاستنتاج.'}
          recorded={readings.length ? `تم تسجيل ${readings.length} ${readings.length === 1 ? 'قراءة' : 'قراءات'}.` : 'ابدأ بقياس الحجم الحالي.'}
        />
      </div>
      <Worksheet experiment="boyle" />
    </div>
  );
}

function TemperatureExperiment() {
  const [temperature, setTemperature] = useState(6);
  const [readings, setReadings] = useState<number[]>([]);
  const bath = temperature <= 10 ? 'ice' : temperature >= 35 ? 'warm' : 'middle';
  const values = { temp: temperature, volume: 78 + temperature * 2.75, size: .72 + temperature * .0105, label: bath === 'ice' ? 'حمام ثلجي' : bath === 'warm' ? 'حمام مائي ساخن' : 'حمام معتدل' };
  const registerReading = () => setReadings((current) => current.includes(temperature) ? current : [...current, temperature]);
  const ready = readings.length >= 2;
  const colder = readings.length ? Math.min(...readings) : temperature;
  const warmer = readings.length ? Math.max(...readings) : temperature;
  return (
    <div className="experiment-grid">
      <div className="simulation-area">
        <div className="bath-switch" role="tablist" aria-label="اختيار الحمام">
          <button className={`bath-button ${bath === 'ice' ? 'active' : ''}`} onClick={() => setTemperature(6)} data-testid="button-ice-bath">الحمام الثلجي</button>
          <button className={`bath-button ${bath === 'middle' ? 'active' : ''}`} onClick={() => setTemperature(25)} data-testid="button-middle-bath">حمام معتدل</button>
          <button className={`bath-button ${bath === 'warm' ? 'active' : ''}`} onClick={() => setTemperature(48)} data-testid="button-warm-bath">الماء الساخن</button>
        </div>
        <LabProgress step={readings.length === 0 ? 0 : readings.length === 1 ? 1 : 2} labels={['اختر الحرارة', 'سجّل الحجم', 'استنتج']} />
        <div className="control-layout">
          <div className="balloon-stage">
            <div className="balloon" style={{ transform: `scale(${values.size})` }} />
            <div className="bath-caption"><span>{values.label}</span><span>الضغط ثابت</span></div>
          </div>
          <div className="control-card">
            <h4>اضبط الحرارة وراقب البالون</h4>
            <div className="label-row"><span>درجة حرارة الحمام</span><span className="value-pill">{temperature}°C</span></div>
            <input type="range" min="0" max="60" step="1" value={temperature} onChange={(event) => setTemperature(Number(event.target.value))} data-testid="input-temperature-slider" />
            <div className="range-scale"><span>0°C</span><span>60°C</span></div>
            <div className="result-grid">
              <div className="result-tile"><span>درجة الحرارة</span><strong data-testid="value-temperature">{values.temp}°C</strong></div>
              <div className="result-tile"><span>حجم البالون</span><strong data-testid="value-balloon-volume">{values.volume.toFixed(0)} mL</strong></div>
              <div className="result-tile"><span>الحالة</span><strong>{bath === 'ice' ? 'منكمش' : bath === 'warm' ? 'متمدّد' : 'متوسط'}</strong></div>
            </div>
            <button className="record-button" onClick={registerReading} data-testid="button-record-temperature"><BookOpen size={15} /> سجّل هذه القراءة</button>
            <div className="reading-list"><span>الحرارات المسجلة</span><div>{readings.length ? readings.map((reading) => <b key={reading}>{reading}°C</b>) : <em>لم تُسجّل قراءة بعد</em>}</div></div>
          </div>
        </div>
        <ConclusionCard
          ready={ready}
          observation={ready ? `عند رفع الحرارة من ${colder}°C إلى ${warmer}°C تغيّر حجم البالون من ${(78 + colder * 2.75).toFixed(0)} إلى ${(78 + warmer * 2.75).toFixed(0)} mL.` : 'اختر درجة حرارة منخفضة ثم درجة أعلى، وسجّل حجم البالون في الحالتين.'}
          conclusion={ready ? 'عند ثبات الضغط، يزداد حجم الغاز بزيادة درجة حرارته؛ لأن جسيماته تتحرك أسرع فيحتاج الغاز إلى حيز أكبر.' : 'الاستنتاج يظهر بعد تسجيل قراءتين لدرجتي حرارة مختلفتين.'}
          recorded={readings.length ? `تم تسجيل ${readings.length} ${readings.length === 1 ? 'قراءة' : 'قراءات'}.` : 'ابدأ بحمام ثلجي أو حمام ساخن.'}
        />
      </div>
      <Worksheet experiment="temperature" />
    </div>
  );
}

const evaporationLiquids = [
  { id: 'ethanol', label: 'الإيثانول', rate: 0.035 },
  { id: 'ether', label: 'ثنائي إيثيل الإيثر', rate: 0.07 },
] as const;

function EvaporationExperiment() {
  const [warmTemperature, setWarmTemperature] = useState(40);
  const [duration, setDuration] = useState(5);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const [running, setRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setElapsedMinutes((current) => Math.min(duration, Number((current + 0.25).toFixed(2))));
    }, 250);
    return () => window.clearInterval(timer);
  }, [running, duration]);

  useEffect(() => {
    if (running && elapsedMinutes >= duration) setRunning(false);
  }, [elapsedMinutes, duration, running]);

  const temperatureFor = (bath: 'cool' | 'warm') => bath === 'cool' ? 15 : warmTemperature;
  const remainingFor = (liquid: typeof evaporationLiquids[number], temperature: number) => {
    const temperatureFactor = Math.exp((temperature - 15) * 0.022);
    return 10 * Math.exp(-liquid.rate * temperatureFactor * elapsedMinutes);
  };
  const resetElapsed = () => {
    setElapsedMinutes(0);
    setHasRun(false);
    setRunning(false);
  };
  const updateWarmTemperature = (value: number) => {
    setWarmTemperature(value);
    resetElapsed();
  };
  const updateDuration = (value: number) => {
    setDuration(value);
    resetElapsed();
  };
  const toggleSimulation = () => {
    if (running) {
      setRunning(false);
      return;
    }
    if (elapsedMinutes >= duration) setElapsedMinutes(0);
    setHasRun(true);
    setRunning(true);
  };

  const ready = hasRun && !running && elapsedMinutes >= duration;
  const baths = [
    { id: 'warm' as const, label: 'حمام مائي دافئ', color: 'warm' },
    { id: 'cool' as const, label: 'حمام مائي بارد', color: 'cool' },
  ];

  return (
    <div className="experiment-grid">
      <div className="simulation-area evaporation-lab">
        <LabProgress step={running || (hasRun && !ready) ? 1 : ready ? 2 : 0} labels={['حضّر العينات', 'راقب التبخر', 'استنتج']} />
        <div className="evaporation-topline">
          <div><strong>أربع عينات، مقارنة عادلة</strong><span>10 mL في كل أنبوب · قطر الفوهة ثابت</span></div>
          <div className={`evap-clock ${running ? 'is-running' : ''}`}><Waves size={16} /><b>{elapsedMinutes.toFixed(1)}</b><span>دقيقة محاكاة</span></div>
        </div>
        <div className="evap-grid">
          <div className="evap-controls">
            <div className="control-card">
              <h4>ظروف التجربة</h4>
              <div className="bath-setting">
                <label className="label-row" htmlFor="evap-temperature"><span>حرارة الحمام الدافئ</span><span className="value-pill">{warmTemperature}°C</span></label>
                <input id="evap-temperature" type="range" min="30" max="50" step="1" disabled={running} value={warmTemperature} onChange={(event) => updateWarmTemperature(Number(event.target.value))} data-testid="input-evap-temperature" />
                <div className="range-scale"><span>30°C</span><span>50°C</span></div>
              </div>
              <div className="bath-setting">
                <label className="label-row" htmlFor="evap-time"><span>مدة التجربة</span><span className="value-pill">{duration} دقائق</span></label>
                <input id="evap-time" type="range" min="3" max="10" step="1" disabled={running} value={duration} onChange={(event) => updateDuration(Number(event.target.value))} data-testid="input-evap-time" />
                <div className="range-scale"><span>3 دقائق</span><span>10 دقائق</span></div>
              </div>
              <div className="timer-track" aria-label={`اكتمل ${Math.round((elapsedMinutes / duration) * 100)}% من وقت التجربة`}>
                <div style={{ width: `${Math.min(100, (elapsedMinutes / duration) * 100)}%` }} />
              </div>
              <button className="record-button primary-record" onClick={toggleSimulation} data-testid="button-run-evaporation">
                {running ? <Pause size={15} /> : <Play size={15} />}
                {running ? 'إيقاف مؤقت' : ready ? 'إعادة تشغيل التجربة' : hasRun ? 'استئناف المحاكاة' : 'ابدأ المحاكاة'}
              </button>
              <button className="evap-reset" onClick={resetElapsed} disabled={!hasRun && elapsedMinutes === 0}><RotateCcw size={13} /> تصفير المؤقت والعينات</button>
            </div>
            <p className="model-note">كل ثانية حقيقية تساوي دقيقة محاكاة. القيم تقديرية للتعلم، وتختلف التجربة الواقعية حسب مساحة السطح وحركة الهواء.</p>
          </div>
          <div className="evap-apparatus">
            {baths.map((bath) => {
              const temperature = temperatureFor(bath.id);
              return (
                <section className={`bath-station ${bath.color}`} key={bath.id} aria-label={`${bath.label} ${temperature} درجة`}>
                  <header className="station-head">
                    <div><span>{bath.label}</span><strong>{temperature}°C</strong></div>
                    <Thermometer size={18} />
                  </header>
                  <div className="bath-tank">
                    <div className="bath-water" />
                    {evaporationLiquids.map((liquid) => {
                      const remaining = remainingFor(liquid, temperature);
                      const escaped = 10 - remaining;
                      const vaporIsActive = hasRun && elapsedMinutes > 0;
                      return (
                        <div className="tube-sample" key={liquid.id}>
                          <div className="tube-position">
                            <div className={`vapor-cloud ${vaporIsActive ? 'is-releasing' : ''} ${liquid.id === 'ether' ? 'fast-vapor' : ''}`} aria-hidden="true"><i /><i /><i /></div>
                            <div className="test-tube">
                              <div className="tube-glint" />
                              <div className="tube-liquid" style={{ height: `${Math.max(2, remaining * 7.4)}%` }} />
                              <div className="tube-graduations"><i /><i /><i /><i /></div>
                            </div>
                          </div>
                          <strong className="sample-name">{liquid.label}</strong>
                          <span className="sample-volume" data-testid={`value-${liquid.id}-${bath.id}`}>{remaining.toFixed(1)} mL</span>
                          <span className="sample-escaped">تبخر {escaped.toFixed(1)} mL</span>
                        </div>
                      );
                    })}
                    <div className="bath-waterline"><span>ماء الحمام</span></div>
                  </div>
                </section>
              );
            })}
          </div>
        </div>
        <div className="evap-data-table">
          <div className="evap-table-heading"><h4>جدول الملاحظات</h4><span>الحجم المتبقي من أصل 10 mL</span></div>
          <div className="evap-table-scroll">
            <table>
              <thead><tr><th>السائل</th><th>عند 15°C</th><th>عند {warmTemperature}°C</th><th>المقارنة</th></tr></thead>
              <tbody>{evaporationLiquids.map((liquid) => {
                const coolRemaining = remainingFor(liquid, 15);
                const warmRemaining = remainingFor(liquid, warmTemperature);
                return <tr key={liquid.id}><th>{liquid.label}</th><td>{coolRemaining.toFixed(1)} mL</td><td>{warmRemaining.toFixed(1)} mL</td><td>{ready ? `تبخر ${(coolRemaining - warmRemaining).toFixed(1)} mL أكثر في الدفء` : 'شغّل التجربة للمقارنة'}</td></tr>;
              })}</tbody>
            </table>
          </div>
        </div>
        <ConclusionCard
          ready={ready}
          observation={ready ? `بعد ${duration} دقائق: بقي ${remainingFor(evaporationLiquids[0], 15).toFixed(1)} mL من الإيثانول عند 15°C و${remainingFor(evaporationLiquids[0], warmTemperature).toFixed(1)} mL عند ${warmTemperature}°C؛ وبقي ${remainingFor(evaporationLiquids[1], 15).toFixed(1)} mL من الإيثر عند 15°C و${remainingFor(evaporationLiquids[1], warmTemperature).toFixed(1)} mL عند ${warmTemperature}°C.` : 'شغّل المؤقت حتى النهاية، ثم قارن حجم كل سائل بين الحمامين.'}
          conclusion={ready ? `في ظروف المحاكاة، رفع الحرارة من 15°C إلى ${warmTemperature}°C زاد مقدار التبخر في السائلين. كما أن الإيثر أكثر تطايرًا من الإيثانول؛ إذ بقيت منه كمية أقل في الحمامين.` : 'سيظهر الاستنتاج بعد اكتمال زمن المحاكاة، بناءً على المقارنة بين العينات الأربع.'}
          recorded={running ? 'المحاكاة تعمل؛ مستويات السوائل تتغير مع الزمن.' : ready ? 'اكتملت المقارنة بين السائلين ودرجتي الحرارة.' : hasRun ? `تقدّم الزمن: ${elapsedMinutes.toFixed(1)} من ${duration} دقائق.` : 'لم تبدأ المحاكاة بعد.'}
        />
      </div>
      <Worksheet experiment="evaporation" />
    </div>
  );
}

function App() {
  const [experiment, setExperiment] = useState<ExperimentKey>('boyle');
  const [resetKey, setResetKey] = useState(0);
  const scrollToExperiments = () => document.getElementById('experiments')?.scrollIntoView({ behavior: 'smooth' });
  const scrollToGuide = () => document.getElementById('guide')?.scrollIntoView({ behavior: 'smooth' });
  const chooseExperiment = (key: ExperimentKey) => { setExperiment(key); setResetKey((keyValue) => keyValue + 1); window.setTimeout(scrollToExperiments, 20); };
  return (
    <div className="lab-page" dir="rtl">
      <header className="site-header">
        <div className="header-bar">
          <a href="#top" className="brand" data-testid="link-home">
            <div className="brand-mark"><FlaskConical size={24} /></div>
            <div><span className="brand-title">مختبرك الكيميائي</span><span className="brand-subtitle">تجارب تفاعلية باللغة العربية</span></div>
          </a>
          <nav className="header-nav" aria-label="التنقل الرئيسي">
            <button className={experiment === 'boyle' ? 'active' : ''} onClick={() => chooseExperiment('boyle')} data-testid="nav-boyle">التجارب</button>
            <button onClick={scrollToGuide} data-testid="nav-guide">دليل المختبر</button>
          </nav>
          <div className="header-note"><span className="signal-dot" /> جلسة تعلّم نشطة</div>
        </div>
      </header>
      <main className="page-main" id="top">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">دفتر المختبر الرقمي · الصف المدرسي</div>
            <h1>حوّل الملاحظة إلى <em>اكتشاف.</em></h1>
            <p className="hero-text">هنا لا نكتفي بقراءة القانون. غيّر المتغير بيدك، شاهد أثره أمامك، وسجّل ما فهمته كما يفعل الكيميائي الحقيقي.</p>
            <div className="hero-actions"><button className="primary-button" onClick={scrollToExperiments} data-testid="button-start-lab">ابدأ التجربة <ChevronDown size={17} /></button><button className="ghost-button" onClick={scrollToGuide} data-testid="button-safety-guide"><ShieldCheck size={16} /> إرشادات السلامة</button></div>
          </div>
          <div className="hero-card">
            <span className="card-kicker">مهمتك اليوم</span><div className="lab-scribble">لاحظ ← غيّر ← استنتج</div>
            <h2>ثلاث تجارب، ومتغير واحد في كل مرة.</h2>
            <div className="mini-stats"><div className="mini-stat"><strong>03</strong><span>تجارب تفاعلية</span></div><div className="mini-stat"><strong>∞</strong><span>طريقة للملاحظة</span></div></div>
            <p className="formula-note">ابدأ بقانون بويل، ثم انتقل إلى الحرارة والتبخر. كل نتيجة هنا قابلة لإعادة التجربة.</p>
          </div>
        </section>

        <section className="experiment-picker" id="experiments">
          <div className="section-heading"><div><h2>أي سؤال ستختبر؟</h2><p>اختر محطة من محطات المختبر وابدأ بتغيير المتغير.</p></div><span className="card-kicker">المحطة {experiment === 'boyle' ? '01' : experiment === 'temperature' ? '02' : '03'} / 03</span></div>
          <div className="experiment-tabs">
            {(Object.keys(experimentInfo) as ExperimentKey[]).map((key, index) => { const item = experimentInfo[key]; const Icon = item.icon; return <button key={key} className={`experiment-tab ${experiment === key ? 'active' : ''}`} onClick={() => chooseExperiment(key)} data-testid={`tab-experiment-${key}`}><div className="tab-icon"><Icon size={19} /></div><div className="tab-text"><strong>{item.title}</strong><span>محطة {String(index + 1).padStart(2, '0')} · تفاعلية</span></div></button>; })}
          </div>
          <div className="experiment-shell">
            <ExperimentHeader experiment={experiment} onReset={() => setResetKey((key) => key + 1)} />
            {experiment === 'boyle' && <BoyleExperiment key={`boyle-${resetKey}`} />}
            {experiment === 'temperature' && <TemperatureExperiment key={`temperature-${resetKey}`} />}
            {experiment === 'evaporation' && <EvaporationExperiment key={`evaporation-${resetKey}`} />}
          </div>
        </section>

        <section className="steps-section" id="guide">
          <div className="section-heading"><div><h2>طريقة العالم الصغير</h2><p>ثلاث عادات تجعل كل تجربة أوضح وأكثر أماناً.</p></div></div>
          <div className="steps">
            <div className="step"><span className="step-number">١</span><div><h4>توقّع قبل أن تغيّر</h4><p>اكتب في ذهنك ماذا سيحدث. التوقع يجعل الفرق مرئياً، حتى لو خالف النتيجة.</p></div></div>
            <div className="step"><span className="step-number">٢</span><div><h4>غيّر متغيراً واحداً</h4><p>ثبّت بقية الظروف حتى تعرف سبب التغيير الحقيقي في الحجم أو الضغط أو التبخر.</p></div></div>
            <div className="step"><span className="step-number">٣</span><div><h4>لاحظ ثم استنتج</h4><p>اقرأ القيم، قارنها بالجدول، ثم صغ النتيجة بجملة من كلماتك أنت.</p></div></div>
          </div>
          <div className="callout"><ShieldCheck size={18} /><span><strong>سلامتك أولاً:</strong> اتبع تعليمات المعلم دائماً، ارتدِ النظارات الواقية، ولا تلمس المواد الكيميائية مباشرة. هذه المحاكاة للتعلم الآمن قبل التجربة الواقعية.</span></div>
        </section>
      </main>
      <footer className="site-footer"><div className="footer-inner"><span>مختبرك الكيميائي · مساحة فضول آمنة</span><span><strong>حقوق الموقع محفوظة لـ قصي</strong> · بدعم من الأستاذ أحمد العمرو</span></div></footer>
    </div>
  );
}

export default App;
/* old duplicated copy from below; ignore it
import { useEffect, useState } from 'react';
import { BookOpen, ChevronDown, Gauge, Lightbulb, RotateCcw, ShieldCheck, Thermometer, Waves, Wind, FlaskConical } from 'lucide-react';
import boyleWorksheet from '@assets/1_1789848594898.webp';
import temperatureWorksheet from '@assets/2_1789848594898.webp';
import evaporationWorksheet from '@assets/3_1789848594897.webp';

type ExperimentKey = 'boyle' | 'temperature' | 'evaporation';

const experimentInfo: Record<ExperimentKey, { title: string; subtitle: string; icon: typeof Gauge; image: string }> = {
  boyle: { title: 'قانون بويل', subtitle: 'الحجم والضغط عند ثبات درجة الحرارة', icon: Gauge, image: boyleWorksheet },
  temperature: { title: 'حجم الغاز ودرجة الحرارة', subtitle: 'العلاقة عند ثبات الضغط', icon: Thermometer, image: temperatureWorksheet },
  evaporation: { title: 'سرعة التبخر', subtitle: 'كيف تغيّر الحرارة والزمن النتيجة؟', icon: Wind, image: evaporationWorksheet },
};

function Worksheet({ experiment }: { experiment: ExperimentKey }) {
  const item = experimentInfo[experiment];
  return (
    <aside className="worksheet-panel" data-testid={`panel-worksheet-${experiment}`}>
      <h4>من ورقة العمل إلى المختبر</h4>
      <div className="worksheet-frame">
        <img src={item.image} alt={`ورقة عمل تجربة ${item.title}`} data-testid={`img-worksheet-${experiment}`} />
      </div>
      <div>
        <p className="worksheet-caption">المرجع الأصلي للتجربة ظاهر هنا. غيّر المتغيرات في المحاكاة، ثم قارِن ملاحظاتك بالخطوات والجدول.</p>
        <div className="worksheet-label"><BookOpen size={13} /> ورقة النشاط الأصلية</div>
      </div>
    </aside>
  );
}

function ExperimentHeader({ experiment, onReset }: { experiment: ExperimentKey; onReset: () => void }) {
  const item = experimentInfo[experiment];
  const Icon = item.icon;
  return (
    <div className="experiment-head">
      <div className="experiment-title">
        <div className="experiment-title-icon"><Icon size={21} /></div>
        <div><h3>{item.title}</h3><p>{item.subtitle}</p></div>
      </div>
      <button className="reset-button" onClick={onReset} data-testid={`button-reset-${experiment}`}><RotateCcw size={14} /><span>إعادة التجربة</span></button>
    </div>
  );
}

function LabProgress({ step, labels }: { step: number; labels: string[] }) {
  return (
    <div className="lab-progress" aria-label="مراحل التجربة">
      {labels.map((label, index) => (
        <div className={`progress-step ${index <= step ? 'is-active' : ''}`} key={label}>
          <span>{index + 1}</span>
          <small>{label}</small>
        </div>
      ))}
    </div>
  );
}

function ConclusionCard({ observation, conclusion, ready, recorded }: { observation: string; conclusion: string; ready: boolean; recorded: string }) {
  return (
    <div className={`conclusion-card ${ready ? 'is-ready' : ''}`}>
      <div className="conclusion-heading">
        <div className="conclusion-icon"><Lightbulb size={18} /></div>
        <div><span>محطة الاستنتاج</span><h4>{ready ? 'أحسنت، هذه خلاصة ملاحظتك' : 'سجّل أكثر من قراءة لتصل إلى الاستنتاج'}</h4></div>
      </div>
      <div className="conclusion-body">
        <div><span>الملاحظة</span><p>{observation}</p></div>
        <div><span>الاستنتاج العلمي</span><p>{conclusion}</p></div>
      </div>
      <div className="recorded-note"><Waves size={14} /> {recorded}</div>
    </div>
  );
}

function BoyleExperiment() {
  const [volume, setVolume] = useState(20);
  const [readings, setReadings] = useState<number[]>([]);
  const pressure = 600 / volume;
  const inverse = 1 / pressure;
  const volumes = [10, 15, 20, 25, 30, 35, 40];
  const setV = (value: number) => setVolume(Math.min(40, Math.max(10, value || 10)));
  const registerReading = () => setReadings((current) => current.includes(volume) ? current : [...current, volume]);
  const progressStep = readings.length === 0 ? 0 : readings.length === 1 ? 1 : 2;
  const lowest = readings.length ? Math.min(...readings) : volume;
  const highest = readings.length ? Math.max(...readings) : volume;
  const ready = readings.length >= 2;
  return (
    <div className="experiment-grid">
      <div className="simulation-area">
        <LabProgress step={progressStep} labels={['غيّر الحجم', 'سجّل القراءة', 'استنتج']} />
        <div className="control-layout">
          <div>
            <div className="syringe-stage">
              <div className="gauge">{pressure.toFixed(1)} kPa</div>
              <div className="syringe">
                <div className="syringe-nozzle" />
                <div className="syringe-barrel"><div className="syringe-gas" style={{ width: `${((volume - 10) / 30) * 76 + 18}%` }} /><div className="syringe-ticks" /></div>
                <div className="syringe-plunger" style={{ transform: `translateX(-${(40 - volume) * 1.25}px)` }} />
              </div>
            </div>
            <div className="chart-box">
              <div className="chart-title"><span>سجل القياسات</span><span className="chart-legend"><i style={{ color: 'hsl(37 75% 61%)' }}>■</i> الحجم&nbsp; <i style={{ color: 'hsl(8 70% 60%)' }}>■</i> الضغط</span></div>
              <div className="bars">{volumes.map((v) => <div className="bar-column" key={v}><div className="bar volume" style={{ height: `${(v / 40) * 75}%` }} /><div className="bar pressure" style={{ height: `${(600 / v / 6) * 75}%` }} /></div>)}</div>
              <div className="chart-labels">{volumes.map((v) => <span key={v}>{v}</span>)}</div>
            </div>
          </div>
          <div className="control-card">
            <h4>اسحب مكبس المحقن واختبر العلاقة</h4>
            <div className="label-row"><span>حجم الغاز</span><span className="value-pill" data-testid="value-volume">{volume} mL</span></div>
            <input type="range" min="10" max="40" step="5" value={volume} onChange={(event) => setV(Number(event.target.value))} data-testid="input-volume-slider" />
            <div className="range-scale"><span>10 mL</span><span>40 mL</span></div>
            <input className="number-input" type="number" min="10" max="40" step="5" value={volume} onChange={(event) => setV(Number(event.target.value))} aria-label="حجم الغاز بالمليلتر" data-testid="input-volume-number" />
            <button className="record-button" onClick={registerReading} data-testid="button-record-boyle"><BookOpen size={15} /> سجّل هذه القراءة</button>
            <div className="result-grid">
              <div className="result-tile"><span>الضغط</span><strong data-testid="value-pressure">{pressure.toFixed(1)} kPa</strong></div>
              <div className="result-tile"><span>1 ÷ الضغط</span><strong data-testid="value-inverse">{inverse.toFixed(3)}</strong></div>
              <div className="result-tile"><span>ثابت التجربة</span><strong>600</strong></div>
            </div>
            <div className="reading-list">
              <span>القراءات المسجلة</span>
              <div>{readings.length ? readings.map((reading) => <b key={reading}>{reading} mL</b>) : <em>لم تُسجّل قراءة بعد</em>}</div>
            </div>
          </div>
        </div>
        <ConclusionCard
          ready={ready}
          observation={ready ? `عند تقليل الحجم من ${highest} mL إلى ${lowest} mL ارتفع الضغط من ${(600 / highest).toFixed(1)} إلى ${(600 / lowest).toFixed(1)} kPa.` : 'حرّك المكبس بين قيمتين مختلفتين، ثم سجّل كل قراءة للمقارنة.'}
          conclusion={ready ? 'عند ثبات درجة الحرارة، يتناسب ضغط الغاز عكسياً مع حجمه؛ كلما قلّ الحجم زاد الضغط، ويبقى حاصل الضرب قريباً من ثابت التجربة.' : 'البيانات لم تكتمل بعد. اجمع قراءتين على الأقل قبل كتابة الاستنتاج.'}
          recorded={readings.length ? `تم تسجيل ${readings.length} ${readings.length === 1 ? 'قراءة' : 'قراءات'}.` : 'ابدأ بقياس الحجم الحالي.'}
        />
      </div>
      <Worksheet experiment="boyle" />
    </div>
  );
}

function TemperatureExperiment() {
  const [temperature, setTemperature] = useState(6);
  const [readings, setReadings] = useState<number[]>([]);
  const bath = temperature <= 10 ? 'ice' : temperature >= 35 ? 'warm' : 'middle';
  const values = { temp: temperature, volume: 78 + temperature * 2.75, size: .72 + temperature * .0105, label: bath === 'ice' ? 'حمام ثلجي' : bath === 'warm' ? 'حمام مائي ساخن' : 'حمام معتدل' };
  const registerReading = () => setReadings((current) => current.includes(temperature) ? current : [...current, temperature]);
  const ready = readings.length >= 2;
  const colder = readings.length ? Math.min(...readings) : temperature;
  const warmer = readings.length ? Math.max(...readings) : temperature;
  return (
    <div className="experiment-grid">
      <div className="simulation-area">
        <div className="bath-switch" role="tablist" aria-label="اختيار الحمام">
          <button className={`bath-button ${bath === 'ice' ? 'active' : ''}`} onClick={() => setTemperature(6)} data-testid="button-ice-bath">الحمام الثلجي</button>
          <button className={`bath-button ${bath === 'middle' ? 'active' : ''}`} onClick={() => setTemperature(25)} data-testid="button-middle-bath">حمام معتدل</button>
          <button className={`bath-button ${bath === 'warm' ? 'active' : ''}`} onClick={() => setTemperature(48)} data-testid="button-warm-bath">الماء الساخن</button>
        </div>
        <LabProgress step={readings.length === 0 ? 0 : readings.length === 1 ? 1 : 2} labels={['اختر الحرارة', 'سجّل الحجم', 'استنتج']} />
        <div className="control-layout">
          <div className="balloon-stage">
            <div className="balloon" style={{ transform: `scale(${values.size})` }} />
            <div className="bath-caption"><span>{values.label}</span><span>الضغط ثابت</span></div>
          </div>
          <div className="control-card">
            <h4>اضبط الحرارة وراقب البالون</h4>
            <div className="label-row"><span>درجة حرارة الحمام</span><span className="value-pill">{temperature}°C</span></div>
            <input type="range" min="0" max="60" step="1" value={temperature} onChange={(event) => setTemperature(Number(event.target.value))} data-testid="input-temperature-slider" />
            <div className="range-scale"><span>0°C</span><span>60°C</span></div>
            <div className="result-grid">
              <div className="result-tile"><span>درجة الحرارة</span><strong data-testid="value-temperature">{values.temp}°C</strong></div>
              <div className="result-tile"><span>حجم البالون</span><strong data-testid="value-balloon-volume">{values.volume.toFixed(0)} mL</strong></div>
              <div className="result-tile"><span>الحالة</span><strong>{bath === 'ice' ? 'منكمش' : bath === 'warm' ? 'متمدّد' : 'متوسط'}</strong></div>
            </div>
            <button className="record-button" onClick={registerReading} data-testid="button-record-temperature"><BookOpen size={15} /> سجّل هذه القراءة</button>
            <div className="reading-list"><span>الحرارات المسجلة</span><div>{readings.length ? readings.map((reading) => <b key={reading}>{reading}°C</b>) : <em>لم تُسجّل قراءة بعد</em>}</div></div>
          </div>
        </div>
        <ConclusionCard
          ready={ready}
          observation={ready ? `عند رفع الحرارة من ${colder}°C إلى ${warmer}°C تغيّر حجم البالون من ${(78 + colder * 2.75).toFixed(0)} إلى ${(78 + warmer * 2.75).toFixed(0)} mL.` : 'اختر درجة حرارة منخفضة ثم درجة أعلى، وسجّل حجم البالون في الحالتين.'}
          conclusion={ready ? 'عند ثبات الضغط، يزداد حجم الغاز بزيادة درجة حرارته؛ لأن جسيماته تتحرك أسرع فيحتاج الغاز إلى حيز أكبر.' : 'الاستنتاج يظهر بعد تسجيل قراءتين لدرجتي حرارة مختلفتين.'}
          recorded={readings.length ? `تم تسجيل ${readings.length} ${readings.length === 1 ? 'قراءة' : 'قراءات'}.` : 'ابدأ بحمام ثلجي أو حمام ساخن.'}
        />
      </div>
      <Worksheet experiment="temperature" />
    </div>
  );
}

const evaporationLiquids = [
  { id: 'ethanol', label: 'الإيثانول', rate: 0.035 },
  { id: 'ether', label: 'ثنائي إيثيل الإيثر', rate: 0.07 },
] as const;

function EvaporationExperiment() {
  const [warmTemperature, setWarmTemperature] = useState(40);
  const [duration, setDuration] = useState(5);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const [running, setRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setElapsedMinutes((current) => Math.min(duration, Number((current + 0.25).toFixed(2))));
    }, 250);
    return () => window.clearInterval(timer);
  }, [running, duration]);

  useEffect(() => {
    if (running && elapsedMinutes >= duration) setRunning(false);
  }, [elapsedMinutes, duration, running]);

  const temperatureFor = (bath: 'cool' | 'warm') => bath === 'cool' ? 15 : warmTemperature;
  const remainingFor = (liquid: typeof evaporationLiquids[number], temperature: number) => {
    const temperatureFactor = Math.exp((temperature - 15) * 0.022);
    return 10 * Math.exp(-liquid.rate * temperatureFactor * elapsedMinutes);
  };
  const resetElapsed = () => {
    setElapsedMinutes(0);
    setHasRun(false);
    setRunning(false);
  };
  const updateWarmTemperature = (value: number) => {
    setWarmTemperature(value);
    resetElapsed();
  };
  const updateDuration = (value: number) => {
    setDuration(value);
    resetElapsed();
  };
  const toggleSimulation = () => {
    if (running) {
      setRunning(false);
      return;
    }
    if (elapsedMinutes >= duration) setElapsedMinutes(0);
    setHasRun(true);
    setRunning(true);
  };

  const ready = hasRun && !running && elapsedMinutes >= duration;
  const baths = [
    { id: 'warm' as const, label: 'حمام مائي دافئ', color: 'warm' },
    { id: 'cool' as const, label: 'حمام مائي بارد', color: 'cool' },
  ];

  return (
    <div className="experiment-grid">
      <div className="simulation-area evaporation-lab">
        <LabProgress step={running || (hasRun && !ready) ? 1 : ready ? 2 : 0} labels={['حضّر العينات', 'راقب التبخر', 'استنتج']} />
        <div className="evaporation-topline">
          <div><strong>أربع عينات، مقارنة عادلة</strong><span>10 mL في كل أنبوب · قطر الفوهة ثابت</span></div>
          <div className={`evap-clock ${running ? 'is-running' : ''}`}><Waves size={16} /><b>{elapsedMinutes.toFixed(1)}</b><span>دقيقة محاكاة</span></div>
        </div>
        <div className="evap-grid">
          <div className="evap-controls">
            <div className="control-card">
              <h4>ظروف التجربة</h4>
              <div className="bath-setting">
                <label className="label-row" htmlFor="evap-temperature"><span>حرارة الحمام الدافئ</span><span className="value-pill">{warmTemperature}°C</span></label>
                <input id="evap-temperature" type="range" min="30" max="50" step="1" disabled={running} value={warmTemperature} onChange={(event) => updateWarmTemperature(Number(event.target.value))} data-testid="input-evap-temperature" />
                <div className="range-scale"><span>30°C</span><span>50°C</span></div>
              </div>
              <div className="bath-setting">
                <label className="label-row" htmlFor="evap-time"><span>مدة التجربة</span><span className="value-pill">{duration} دقائق</span></label>
                <input id="evap-time" type="range" min="3" max="10" step="1" disabled={running} value={duration} onChange={(event) => updateDuration(Number(event.target.value))} data-testid="input-evap-time" />
                <div className="range-scale"><span>3 دقائق</span><span>10 دقائق</span></div>
              </div>
              <div className="timer-track" aria-label={`اكتمل ${Math.round((elapsedMinutes / duration) * 100)}% من وقت التجربة`}>
                <div style={{ width: `${Math.min(100, (elapsedMinutes / duration) * 100)}%` }} />
              </div>
              <button className="record-button primary-record" onClick={toggleSimulation} data-testid="button-run-evaporation">
                {running ? <Pause size={15} /> : <Play size={15} />}
                {running ? 'إيقاف مؤقت' : ready ? 'إعادة تشغيل التجربة' : hasRun ? 'استئناف المحاكاة' : 'ابدأ المحاكاة'}
              </button>
              <button className="evap-reset" onClick={resetElapsed} disabled={!hasRun && elapsedMinutes === 0}><RotateCcw size={13} /> تصفير المؤقت والعينات</button>
            </div>
            <p className="model-note">كل ثانية حقيقية تساوي دقيقة محاكاة. القيم تقديرية للتعلم، وتختلف التجربة الواقعية حسب مساحة السطح وحركة الهواء.</p>
          </div>
          <div className="evap-apparatus">
            {baths.map((bath) => {
              const temperature = temperatureFor(bath.id);
              return (
                <section className={`bath-station ${bath.color}`} key={bath.id} aria-label={`${bath.label} ${temperature} درجة`}>
                  <header className="station-head">
                    <div><span>{bath.label}</span><strong>{temperature}°C</strong></div>
                    <Thermometer size={18} />
                  </header>
                  <div className="bath-tank">
                    <div className="bath-water" />
                    {evaporationLiquids.map((liquid) => {
                      const remaining = remainingFor(liquid, temperature);
                      const escaped = 10 - remaining;
                      const vaporIsActive = hasRun && elapsedMinutes > 0;
                      return (
                        <div className="tube-sample" key={liquid.id}>
                          <div className="tube-position">
                            <div className={`vapor-cloud ${vaporIsActive ? 'is-releasing' : ''} ${liquid.id === 'ether' ? 'fast-vapor' : ''}`} aria-hidden="true"><i /><i /><i /></div>
                            <div className="test-tube">
                              <div className="tube-glint" />
                              <div className="tube-liquid" style={{ height: `${Math.max(2, remaining * 7.4)}%` }} />
                              <div className="tube-graduations"><i /><i /><i /><i /></div>
                            </div>
                          </div>
                          <strong className="sample-name">{liquid.label}</strong>
                          <span className="sample-volume" data-testid={`value-${liquid.id}-${bath.id}`}>{remaining.toFixed(1)} mL</span>
                          <span className="sample-escaped">تبخر {escaped.toFixed(1)} mL</span>
                        </div>
                      );
                    })}
                    <div className="bath-waterline"><span>ماء الحمام</span></div>
                  </div>
                </section>
              );
            })}
          </div>
        </div>
        <div className="evap-data-table">
          <div className="evap-table-heading"><h4>جدول الملاحظات</h4><span>الحجم المتبقي من أصل 10 mL</span></div>
          <div className="evap-table-scroll">
            <table>
              <thead><tr><th>السائل</th><th>عند 15°C</th><th>عند {warmTemperature}°C</th><th>المقارنة</th></tr></thead>
              <tbody>{evaporationLiquids.map((liquid) => {
                const coolRemaining = remainingFor(liquid, 15);
                const warmRemaining = remainingFor(liquid, warmTemperature);
                return <tr key={liquid.id}><th>{liquid.label}</th><td>{coolRemaining.toFixed(1)} mL</td><td>{warmRemaining.toFixed(1)} mL</td><td>{ready ? `تبخر ${(coolRemaining - warmRemaining).toFixed(1)} mL أكثر في الدفء` : 'شغّل التجربة للمقارنة'}</td></tr>;
              })}</tbody>
            </table>
          </div>
        </div>
        <ConclusionCard
          ready={ready}
          observation={ready ? `بعد ${duration} دقائق: بقي ${remainingFor(evaporationLiquids[0], 15).toFixed(1)} mL من الإيثانول عند 15°C و${remainingFor(evaporationLiquids[0], warmTemperature).toFixed(1)} mL عند ${warmTemperature}°C؛ وبقي ${remainingFor(evaporationLiquids[1], 15).toFixed(1)} mL من الإيثر عند 15°C و${remainingFor(evaporationLiquids[1], warmTemperature).toFixed(1)} mL عند ${warmTemperature}°C.` : 'شغّل المؤقت حتى النهاية، ثم قارن حجم كل سائل بين الحمامين.'}
          conclusion={ready ? `في ظروف المحاكاة، رفع الحرارة من 15°C إلى ${warmTemperature}°C زاد مقدار التبخر في السائلين. كما أن الإيثر أكثر تطايرًا من الإيثانول؛ إذ بقيت منه كمية أقل في الحمامين.` : 'سيظهر الاستنتاج بعد اكتمال زمن المحاكاة، بناءً على المقارنة بين العينات الأربع.'}
          recorded={running ? 'المحاكاة تعمل؛ مستويات السوائل تتغير مع الزمن.' : ready ? 'اكتملت المقارنة بين السائلين ودرجتي الحرارة.' : hasRun ? `تقدّم الزمن: ${elapsedMinutes.toFixed(1)} من ${duration} دقائق.` : 'لم تبدأ المحاكاة بعد.'}
        />
      </div>
      <Worksheet experiment="evaporation" />
    </div>
  );
}

function App() {
  const [experiment, setExperiment] = useState<ExperimentKey>('boyle');
  const [resetKey, setResetKey] = useState(0);
  const scrollToExperiments = () => document.getElementById('experiments')?.scrollIntoView({ behavior: 'smooth' });
  const scrollToGuide = () => document.getElementById('guide')?.scrollIntoView({ behavior: 'smooth' });
  const chooseExperiment = (key: ExperimentKey) => { setExperiment(key); setResetKey((keyValue) => keyValue + 1); window.setTimeout(scrollToExperiments, 20); };
  return (
    <div className="lab-page" dir="rtl">
      <header className="site-header">
        <div className="header-bar">
          <a href="#top" className="brand" data-testid="link-home">
            <div className="brand-mark"><FlaskConical size={24} /></div>
            <div><span className="brand-title">مختبرك الكيميائي</span><span className="brand-subtitle">تجارب تفاعلية باللغة العربية</span></div>
          </a>
          <nav className="header-nav" aria-label="التنقل الرئيسي">
            <button className={experiment === 'boyle' ? 'active' : ''} onClick={() => chooseExperiment('boyle')} data-testid="nav-boyle">التجارب</button>
            <button onClick={scrollToGuide} data-testid="nav-guide">دليل المختبر</button>
          </nav>
          <div className="header-note"><span className="signal-dot" /> جلسة تعلّم نشطة</div>
        </div>
      </header>
      <main className="page-main" id="top">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">دفتر المختبر الرقمي · الصف المدرسي</div>
            <h1>حوّل الملاحظة إلى <em>اكتشاف.</em></h1>
            <p className="hero-text">هنا لا نكتفي بقراءة القانون. غيّر المتغير بيدك، شاهد أثره أمامك، وسجّل ما فهمته كما يفعل الكيميائي الحقيقي.</p>
            <div className="hero-actions"><button className="primary-button" onClick={scrollToExperiments} data-testid="button-start-lab">ابدأ التجربة <ChevronDown size={17} /></button><button className="ghost-button" onClick={scrollToGuide} data-testid="button-safety-guide"><ShieldCheck size={16} /> إرشادات السلامة</button></div>
          </div>
          <div className="hero-card">
            <span className="card-kicker">مهمتك اليوم</span><div className="lab-scribble">لاحظ ← غيّر ← استنتج</div>
            <h2>ثلاث تجارب، ومتغير واحد في كل مرة.</h2>
            <div className="mini-stats"><div className="mini-stat"><strong>03</strong><span>تجارب تفاعلية</span></div><div className="mini-stat"><strong>∞</strong><span>طريقة للملاحظة</span></div></div>
            <p className="formula-note">ابدأ بقانون بويل، ثم انتقل إلى الحرارة والتبخر. كل نتيجة هنا قابلة لإعادة التجربة.</p>
          </div>
        </section>

        <section className="experiment-picker" id="experiments">
          <div className="section-heading"><div><h2>أي سؤال ستختبر؟</h2><p>اختر محطة من محطات المختبر وابدأ بتغيير المتغير.</p></div><span className="card-kicker">المحطة {experiment === 'boyle' ? '01' : experiment === 'temperature' ? '02' : '03'} / 03</span></div>
          <div className="experiment-tabs">
            {(Object.keys(experimentInfo) as ExperimentKey[]).map((key, index) => { const item = experimentInfo[key]; const Icon = item.icon; return <button key={key} className={`experiment-tab ${experiment === key ? 'active' : ''}`} onClick={() => chooseExperiment(key)} data-testid={`tab-experiment-${key}`}><div className="tab-icon"><Icon size={19} /></div><div className="tab-text"><strong>{item.title}</strong><span>محطة {String(index + 1).padStart(2, '0')} · تفاعلية</span></div></button>; })}
          </div>
          <div className="experiment-shell">
            <ExperimentHeader experiment={experiment} onReset={() => setResetKey((key) => key + 1)} />
            {experiment === 'boyle' && <BoyleExperiment key={`boyle-${resetKey}`} />}
            {experiment === 'temperature' && <TemperatureExperiment key={`temperature-${resetKey}`} />}
            {experiment === 'evaporation' && <EvaporationExperiment key={`evaporation-${resetKey}`} />}
          </div>
        </section>

        <section className="steps-section" id="guide">
          <div className="section-heading"><div><h2>طريقة العالم الصغير</h2><p>ثلاث عادات تجعل كل تجربة أوضح وأكثر أماناً.</p></div></div>
          <div className="steps">
            <div className="step"><span className="step-number">١</span><div><h4>توقّع قبل أن تغيّر</h4><p>اكتب في ذهنك ماذا سيحدث. التوقع يجعل الفرق مرئياً، حتى لو خالف النتيجة.</p></div></div>
            <div className="step"><span className="step-number">٢</span><div><h4>غيّر متغيراً واحداً</h4><p>ثبّت بقية الظروف حتى تعرف سبب التغيير الحقيقي في الحجم أو الضغط أو التبخر.</p></div></div>
            <div className="step"><span className="step-number">٣</span><div><h4>لاحظ ثم استنتج</h4><p>اقرأ القيم، قارنها بالجدول، ثم صغ النتيجة بجملة من كلماتك أنت.</p></div></div>
          </div>
          <div className="callout"><ShieldCheck size={18} /><span><strong>سلامتك أولاً:</strong> اتبع تعليمات المعلم دائماً، ارتدِ النظارات الواقية، ولا تلمس المواد الكيميائية مباشرة. هذه المحاكاة للتعلم الآمن قبل التجربة الواقعية.</span></div>
        </section>
      </main>
      <footer className="site-footer"><div className="footer-inner"><span>مختبرك الكيميائي · مساحة فضول آمنة</span><span><strong>حقوق الموقع محفوظة لـ قصي</strong> · بدعم من الأستاذ أحمد العمرو</span></div></footer>
    </div>
  );
}

export default App;
*/
