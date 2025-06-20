import { useNavigate } from "react-router-dom";
import "../../styles/ArnyStrikePages/strategyScreen.css";
function strategyScreen() {
  const navigate = useNavigate();

  const handleStrategyPage = () => {
    navigate(`/Army-Strike`);
  };
  return (
    <div className="cover">
      <button
        className="btn btn-dark text-light rounded-pill px-3 py-2"
        onClick={handleStrategyPage}
        style={{ position: "fixed", right: "20px", top: "20px" }}
      >
        <i className="bi bi-x fs-1 "></i>
      </button>
      <div className="container-fluid">
        <div className="d-flex justify-content-start align-items-start my-3">
          <div className="">
            <img
              src="/myarmywithoutgun.svg"
              alt=""
              className="side_images_top"
            />
          </div>
          <div className="text-start my-2">
            <h1 className="fw-bold"> STRATEGY SCREEN</h1>
            <h1 className="fw-bold">Welcome, Commander! Here's your mission</h1>
            <h3>
              To win the battle, you must solve the expression using the correct
              order of operations. Each operation is guarded by soldiers and
              powerful math symbols. Follow the steps below carefully:
            </h3>
          </div>
        </div>

        <div className="row">
          <div className="col-12 d-flex gap-2 my-2">
            <div className="">
              <img src="/Parentheses.svg" alt="" className="side_images" />
            </div>
            <label className="fs-3 fw-bold">1. </label>
            <div>
              <div className="fs-3 fw-bold"> Parentheses</div>
              <div className="fs-4">Start with the strongest defenses!</div>
              <div className="fs-4">
                Clear the fortress gates (symbols inside parentheses).
              </div>
            </div>
          </div>
          <div className="col-12 d-flex gap-2 my-2">
            <div className="">
              <img src="/Power-up.svg" alt="" className="side_images" />
            </div>
            <label className="fs-3 fw-bold">2. </label>
            <div>
              <div className="fs-3 fw-bold">Power up your enemies!</div>
              <div className="fs-4">
                Use the power station to handle exponents before facing
                soldiers.
              </div>
            </div>
          </div>
          <div className="col-12 d-flex gap-2 my-2">
            <div className="">
              <img src="/signs/divide.svg" alt="" className="side_images" />
            </div>
            <label className="fs-3 fw-bold">3. </label>
            <div>
              <div className="fs-3 fw-bold">Division</div>
              <div className="fs-4">Break enemy lines!</div>
              <div className="fs-4">
                Divide troops or firepower equally to outsmart them.
              </div>
            </div>
          </div>
          <div className="col-12 d-flex gap-2 my-2">
            <div className="">
              <img
                src="/signs/multiplication.svg"
                alt=""
                className="side_images"
              />
            </div>
            <label className="fs-3 fw-bold">4. </label>
            <div>
              <div className="fs-3 fw-bold">Multiplication</div>
              <div className="fs-4">Reinforce your attack!</div>
              <div className="fs-4">
                Multiply soldiers using the crossed swords strategy.
              </div>
            </div>
          </div>
          <div className="col-12 d-flex gap-2 my-2">
            <div className="">
              <img src="/signs/addition.svg" alt="" className="side_images" />
            </div>
            <label className="fs-3 fw-bold">5. </label>
            <div>
              <div className="fs-3 fw-bold"> Addition</div>
              <div className="fs-4">Join forces</div>
              <div className="fs-4">Combine your remaining units.</div>
            </div>
          </div>
          <div className="col-12 d-flex gap-2 my-2">
            <div className="">
              <img src="/signs/subtract.svg" alt="" className="side_images" />
            </div>
            <label className="fs-3 fw-bold">6. </label>
            <div>
              <div className="fs-3 fw-bold"> Subtraction</div>
              <div className="fs-4">Remove obstacles!</div>
              <div className="fs-4">
                Eliminate extra forces to balance your army.
              </div>
            </div>
          </div>
          <div className="col-12 text-center my-2 ">
            <div className="fs-4">
              Follow this order strictly. If you break it, your calculation will
              go wrong—and you'll be outnumbered!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default strategyScreen;
