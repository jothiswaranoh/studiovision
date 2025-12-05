/**
 * Connection system types for drag-drop functionality
 */

export type DataType = 'flow' | 'number' | 'string' | 'boolean' | 'any' | 'object' | 'array';

export interface Port {
    id: string;
    label?: string;
    dataType: DataType;
}

export interface ConnectionValidation {
    isValid: boolean;
    reason?: string;
}

export interface DragConnectionState {
    blockId: string;
    portId: string;
    portType: 'input' | 'output';
    dataType: DataType;
}

/**
 * Validates if two ports can be connected
 */
export function validateConnection(
    sourcePort: Port,
    targetPort: Port
): ConnectionValidation {
    // Flow connections can only connect to flow ports
    if (sourcePort.dataType === 'flow' || targetPort.dataType === 'flow') {
        if (sourcePort.dataType !== targetPort.dataType) {
            return {
                isValid: false,
                reason: 'Flow ports can only connect to other flow ports',
            };
        }
    }

    // 'any' type can connect to anything
    if (sourcePort.dataType === 'any' || targetPort.dataType === 'any') {
        return { isValid: true };
    }

    // Check type compatibility
    if (sourcePort.dataType !== targetPort.dataType) {
        return {
            isValid: false,
            reason: `Cannot connect ${sourcePort.dataType} to ${targetPort.dataType}`,
        };
    }

    return { isValid: true };
}

/**
 * Gets color for a data type
 */
export function getDataTypeColor(dataType: DataType): string {
    switch (dataType) {
        case 'flow':
            return '#0080FF';
        case 'number':
            return '#00FF88';
        case 'string':
            return '#FF00FF';
        case 'boolean':
            return '#FFAA00';
        case 'any':
            return '#FFFFFF';
        default:
            return '#888888';
    }
}
