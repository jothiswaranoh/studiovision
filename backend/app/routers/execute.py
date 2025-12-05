from fastapi import APIRouter
from pydantic import BaseModel
import traceback
import io
from contextlib import redirect_stdout

router = APIRouter(prefix="/execute", tags=["execute"])


class PythonCode(BaseModel):
    code: str


@router.post("/python")
async def execute_python(payload: PythonCode):
    """Compile and (optionally) execute Python code, returning detailed errors.

    Uses the traceback module to format syntax and runtime errors so the
    frontend console can display type, message, line, column and traceback.
    """
    code = payload.code

    # First pass: syntax check
    try:
        compiled = compile(code, "<user-code>", "exec")
    except SyntaxError as e:
        # For SyntaxError we have direct access to line/column and text
        tb_list = traceback.format_exception(type(e), e, e.__traceback__)
        tb_str = "".join(tb_list)

        return {
            "ok": False,
            "error": {
                "kind": "syntax",
                "type": "SyntaxError",
                "msg": e.msg,
                "line": e.lineno,
                "col": e.offset,
                "text": e.text,
                "traceback": tb_str,
            },
        }

    # Optional second pass: execute to catch runtime errors too
    try:
        # Capture stdout so print() output can be shown in the frontend console
        stdout_buffer = io.StringIO()
        with redirect_stdout(stdout_buffer):
            exec(compiled, {})
        output = stdout_buffer.getvalue()
        return {"ok": True, "error": None, "output": output}
    except Exception as e:  # pragma: no cover - generic runtime path
        tb_list = traceback.format_exception(type(e), e, e.__traceback__)
        tb_str = "".join(tb_list)

        return {
            "ok": False,
            "error": {
                "kind": "runtime",
                "type": e.__class__.__name__,
                "msg": str(e),
                "traceback": tb_str,
            },
        }