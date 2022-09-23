import { scriptTypeToString } from '../utils/convertor';

export default function InputType({ coordinator }) {
  return (
    <div style={{ marginBottom: 10 }}>
      Inputs must be of type {scriptTypeToString(coordinator.round.inputType)}.
    </div>
  );
}
