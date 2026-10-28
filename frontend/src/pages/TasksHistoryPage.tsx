import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { ExecutedTask } from '../types';
import {
  FileText,
  FileSpreadsheet,
  FileDown,
  Download,
  Clock,
  CheckCircle2,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';

export const TasksHistoryPage: React.FC = () => {
  const [tasks, setTasks] = useState<ExecutedTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const data = await api.listTasks();
      setTasks(data);
    } catch (e) {
      // fallback handled in api.ts
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const getTaskIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'excel':
      case 'xlsx':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
      case 'word':
      case 'docx':
        return <FileText className="w-5 h-5 text-blue-400" />;
      case 'pdf':
        return <FileDown className="w-5 h-5 text-red-400" />;
      default:
        return <FileText className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Histórico & Arquivos Gerados
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Consulte os documentos produzidos, planilhas geradas e tarefas concluídas pela IA.
          </p>
        </div>
        <button
          onClick={fetchTasks}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar Lista
        </button>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-mono">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-cyan-400 mb-2" />
            Carregando histórico de tarefas...
          </div>
        ) : tasks.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <FolderOpen className="w-10 h-10 mx-auto text-slate-600" />
            <p className="text-sm font-semibold text-slate-300">Nenhum arquivo ou tarefa registrada ainda</p>
            <p className="text-xs text-slate-500">
              Execute uma automação ou converse no chat da IA para gerar arquivos .xlsx, .docx ou .pdf.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-mono border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Tarefa / Documento</th>
                  <th className="px-6 py-4">Tipo</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Data e Hora</th>
                  <th className="px-6 py-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                          {getTaskIcon(task.task_type)}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{task.title}</p>
                          {task.file_name && (
                            <p className="text-[11px] text-cyan-400 font-mono mt-0.5">
                              {task.file_name}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 uppercase font-mono text-slate-400">
                      {task.task_type}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-mono flex items-center gap-1.5 pt-5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {new Date(task.created_at).toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {task.file_url ? (
                        <a
                          href={task.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Baixar
                        </a>
                      ) : (
                        <span className="text-slate-500 italic">Sem anexo</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
