export default function HomeStats(){
    return(
        <div>
            <h2>Ordenes</h2>
            <div className="grid grid-cols-3 gap-4">
                <div className="tile">
                    <h3 className="tile-header">
                        Hoy
                    </h3>
                    <div className="tile-number">2</div>
                    <div className="title-desc">2 ordenes hoy</div>
                </div>
                <div className="tile">
                    <h3 className="tile-header">
                        Esta Semana
                    </h3>
                    <div className="tile-number">2</div>
                    <div className="title-desc">2 ordenes hoy</div>
                </div>
                <div className="tile">
                    <h3 className="tile-header">
                        Este Mes
                    </h3>
                    <div className="tile-number">2</div>
                    <div className="title-desc">2 ordenes hoy</div>
                </div>
            </div>

            <h2>Ganacias</h2>
            <div className="grid grid-cols-3 gap-4">
                <div className="tile">
                    <h3 className="tile-header">
                        Hoy
                    </h3>
                    <div className="tile-number">$20</div>
                    <div className="title-desc">2 ordenes hoy</div>
                </div>
                <div className="tile">
                    <h3 className="tile-header">
                        Esta Semana
                    </h3>
                    <div className="tile-number">$122</div>
                    <div className="title-desc">2 ordenes hoy</div>
                </div>
                <div className="tile">
                    <h3 className="tile-header">
                        Este Mes
                    </h3>
                    <div className="tile-number">$2550</div>
                    <div className="title-desc">2 ordenes hoy</div>
                </div>
            </div>
        </div>
    )
}